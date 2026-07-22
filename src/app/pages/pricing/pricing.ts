import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResourcesService } from '../../core/services/resources.service';

const SIGNUP_URL = 'https://app.zarklyx.com/auth/signup';

const CURRENCY_SYMBOL: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

interface Plan {
  id: string;
  name: string;
  tagline: string;
  cycle: string;
  /** Numeric price and order, kept for sorting and the yearly-saving maths. */
  amount: number;
  displayOrder: number;
  price: string;
  originalPrice: string;
  discount: number;
  perLabel: string;
  billedLabel: string;
  free: boolean;
  popular: boolean;
  cta: string;
  features: string[];
  /** Kept raw so the compare table can build its rows from real columns. */
  maxClients: number | null;
  maxEmployees: number | null;
  storage: string;
  trialDays: number;
  moduleCount: number;
  descriptions: string[];
}

interface CompareRow {
  icon: string;
  label: string;
  values: string[];
}

@Component({
  selector: 'app-pricing',
  imports: [NgClass, RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing implements OnInit {
  private resourcesService = inject(ResourcesService);

  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly yearly = signal(false);

  private readonly allPlans = signal<Plan[]>([]);

  /**
   * Billing cycle is a per-plan column, so monthly and yearly plans are separate rows.
   * With only one cycle in the data there is nothing to toggle between — hide the switch
   * rather than offer a filter that can only ever return the same list. It reappears on
   * its own once plans of both cycles exist.
   */
  readonly showBillingToggle = computed(
    () => new Set(this.allPlans().map((p) => p.cycle)).size > 1
  );

  readonly plans = computed(() => {
    const plans = this.allPlans();
    if (!this.showBillingToggle()) return plans;
    return plans.filter((p) => p.cycle === (this.yearly() ? 'yearly' : 'monthly'));
  });

  /** Real saving of a yearly plan over the monthly plan of the same name, if any pair exists. */
  readonly yearlySaving = computed(() => {
    const byCycle = (cycle: string) =>
      new Map(this.allPlans().filter((p) => p.cycle === cycle).map((p) => [p.name, p]));
    const monthly = byCycle('monthly');
    const savings = [...byCycle('yearly')].map(([name, yearlyPlan]) => {
      const monthlyPlan = monthly.get(name);
      if (!monthlyPlan) return 0;
      const monthlyTotal = monthlyPlan.amount * 12;
      if (!monthlyTotal || yearlyPlan.amount >= monthlyTotal) return 0;
      return Math.round(((monthlyTotal - yearlyPlan.amount) / monthlyTotal) * 100);
    });
    return savings.length ? Math.max(...savings) : 0;
  });

  readonly compareRows = computed<CompareRow[]>(() => {
    const plans = this.plans();
    if (!plans.length) return [];

    const rows: CompareRow[] = [
      { icon: 'accounts', label: 'Clients', values: plans.map((p) => (p.maxClients ? String(p.maxClients) : 'Unlimited')) },
      { icon: 'users', label: 'Employees', values: plans.map((p) => (p.maxEmployees ? String(p.maxEmployees) : 'Unlimited')) },
      { icon: 'database', label: 'Storage', values: plans.map((p) => p.storage || 'dash') },
      { icon: 'calendar', label: 'Free trial', values: plans.map((p) => (p.trialDays ? `${p.trialDays} days` : 'dash')) },
      { icon: 'chart', label: 'Modules included', values: plans.map((p) => (p.moduleCount ? String(p.moduleCount) : 'dash')) },
    ];

    // There is no feature matrix in the database — only each plan's own free-text
    // plan_description list. A line is only worth a row when at least two plans share it;
    // one listed by a single plan compares nothing and would render as a lone tick in a
    // row of dashes. Plans still show their full list on their own card.
    const shared = new Map<string, number>();
    for (const plan of plans) {
      for (const feature of new Set(plan.descriptions)) {
        shared.set(feature, (shared.get(feature) ?? 0) + 1);
      }
    }
    for (const [feature, count] of shared) {
      if (count < 2) continue;
      rows.push({
        icon: 'feature',
        label: feature,
        values: plans.map((p) => (p.descriptions.includes(feature) ? 'check' : 'dash')),
      });
    }
    return rows;
  });

  /** Static: no plan row backs the Enterprise card — those deals are quoted individually. */
  readonly enterpriseFeatures: readonly string[] = [
    'Unlimited clients and employees',
    'All modules included',
    'Custom storage and pricing',
    'Dedicated account manager',
    '24/7 priority support',
  ];

  readonly trustStrip: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'gift', title: '14-day free trial', desc: 'Full access to every module' },
    { icon: 'shield', title: 'Cancel anytime', desc: 'No long-term contracts' },
    { icon: 'dollar', title: 'All plans include', desc: 'Regular updates & security' },
  ];

  readonly signupUrl = SIGNUP_URL;

  ngOnInit(): void {
    this.resourcesService.getPublicPlans().subscribe({
      next: (res: any) => {
        const rows: any[] = Array.isArray(res?.data) ? res.data : [];
        this.allPlans.set(
          rows
            .map((p) => this.toPlan(p))
            .sort((a, b) => a.displayOrder - b.displayOrder || a.amount - b.amount)
        );
        this.loading.set(false);
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  private toPlan(p: any): Plan {
    const symbol = CURRENCY_SYMBOL[p.currency] || p.currency || '₹';
    const amount = Number(p.price) || 0;
    const actual = Number(p.actual_price) || 0;
    const storage = this.formatStorage(p.maxStorage);
    const trialDays = p.trial_available ? Number(p.trial_days) || 0 : 0;
    const descriptions: string[] = Array.isArray(p.plan_description)
      ? p.plan_description.map((d: any) => String(d).trim()).filter(Boolean)
      : [];

    const features = [
      p.max_clients ? `${p.max_clients} Client${p.max_clients === 1 ? '' : 's'}` : 'Unlimited Clients',
      p.max_employees ? `Up to ${p.max_employees} Employees` : 'Unlimited Employees',
    ];
    if (storage) features.push(`${storage} Storage`);
    if (trialDays) features.push(`${trialDays}-day free trial`);

    return {
      id: p.id,
      name: p.name,
      tagline: p.description || '',
      cycle: p.billing_cycle,
      amount,
      displayOrder: Number(p.display_order) || 0,
      price: symbol + amount.toLocaleString('en-IN'),
      originalPrice: actual > amount ? symbol + actual.toLocaleString('en-IN') : '',
      discount: actual > amount ? Math.round(Number(p.discount) || 0) : 0,
      perLabel: p.timing_unit === 'year' ? 'year' : p.timing_unit === 'day' ? 'day' : 'month',
      billedLabel: p.billing_cycle === 'yearly' ? 'Billed yearly' : 'Billed monthly',
      free: !!p.is_default_free || amount === 0,
      popular: !!p.is_popular,
      cta: p.is_default_free || amount === 0 ? 'Get Started Free' : trialDays ? 'Start Free Trial' : 'Get Started',
      features: [...features, ...descriptions],
      maxClients: p.max_clients ?? null,
      maxEmployees: p.max_employees ?? null,
      storage,
      trialDays,
      moduleCount: this.countModules(p.subscription_plan_module),
      descriptions,
    };
  }

  /**
   * Plans carry one row per leaf module (~78 of them), which is a meaningless number to
   * show. Roll each leaf up to its parent and dedupe, mirroring the portal's plan card.
   */
  private countModules(planModules: any[]): number {
    if (!Array.isArray(planModules)) return 0;
    const names = new Set<string>();
    for (const item of planModules) {
      const mod = item?.modules_subscription_plan_module_moduleIdTomodules;
      if (!mod) continue;
      const name = mod.parentModuleId && mod.modules?.name ? mod.modules.name : mod.name;
      if (name) names.add(name);
    }
    return names.size;
  }

  private formatStorage(bytes: string | number): string {
    const n = Number(bytes);
    if (!n) return '';
    if (n >= 1073741824) return `${(n / 1073741824).toFixed(0)} GB`;
    if (n >= 1048576) return `${(n / 1048576).toFixed(0)} MB`;
    return `${n} KB`;
  }
}
