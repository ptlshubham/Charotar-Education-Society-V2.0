import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-dropbox-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './dropbox.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dropbox.scss',
})
export class DropboxIntegration {
  readonly heroChecklist = [
    'Store and organize files in Dropbox',
    'Access files directly within ZarklyX',
    'Share files and collaborate effortlessly',
  ];

  readonly statCards: ReadonlyArray<{
    label: string;
    value: string;
    change: string;
    color: string;
    points: string;
  }> = [
    {
      label: 'Files Stored',
      value: '18.7K',
      change: '17.3%',
      color: '#00AC47',
      points: '0,13 8,10 16,12 24,7 32,9 40,4 48,6',
    },
    {
      label: 'Files Shared',
      value: '6.2K',
      change: '21.6%',
      color: '#C587CE',
      points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3',
    },
    {
      label: 'Storage Used',
      value: '92.4 GB',
      change: '15.8%',
      color: '#0061FF',
      points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4',
    },
    {
      label: 'Team Collaborations',
      value: '2.9K',
      change: '18.9%',
      color: '#E8A33D',
      points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4',
    },
  ];
  readonly trustBadges: ReadonlyArray<{ icon: string; label: string }> = [
    { icon: 'sync', label: 'Real-time Sync' },
    { icon: 'shield', label: 'Secure Connection' },
    { icon: 'code', label: 'No Code Required' },
  ];

  readonly tabs = ['Overview', 'Features', 'How it works', 'Use cases', 'FAQ'];
  activeTab = 'Overview';

  /** Key features */
  readonly keyFeatures: ReadonlyArray<{
    icon: string;
    color: string;
    title: string;
    desc: string;
  }> = [
    {
      icon: 'folder',
      color: '#0061FF',
      title: 'File Storage & Access',
      desc: 'Store all your important files in Dropbox and access them instantly from ZarklyX.',
    },
    {
      icon: 'sync',
      color: '#3DAFA9',
      title: 'Real-time Sync',
      desc: 'Automatically sync files and folder updates in real-time.',
    },
    {
      icon: 'share',
      color: '#C587CE',
      title: 'File Sharing',
      desc: 'Share files and folders securely with your team or clients.',
    },
    {
      icon: 'shield',
      color: '#E8A33D',
      title: 'Permissions & Security',
      desc: 'Manage access permissions and keep your data safe with Dropbox security.',
    },
    {
      icon: 'history',
      color: '#F17C9F',
      title: 'Version History',
      desc: 'Track file versions and restore previous versions effortlessly.',
    },
    {
      icon: 'eye',
      color: '#3772FF',
      title: 'Preview Files',
      desc: 'Preview documents, images, and videos without downloading.',
    },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'plug', title: '1. Connect', desc: 'Connect your Dropbox account securely.' },
    {
      icon: 'folder',
      title: '2. Select & Authorize',
      desc: 'Choose Dropbox folders and grant the required permissions.',
    },
    {
      icon: 'sync',
      title: '3. Sync Files',
      desc: "We'll sync your files and folders in real-time with ZarklyX.",
    },
    {
      icon: 'share',
      title: '4. Manage & Share',
      desc: 'Access, organize, and share files with your team effortlessly.',
    },
    {
      icon: 'chart',
      title: '5. Collaborate',
      desc: 'Work together and track productivity across your workflows.',
    },
  ];

  /** Use cases */
  readonly useCases: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'folder',
      title: 'Document Management',
      desc: 'Store, organize, and manage all business documents.',
    },
    {
      icon: 'users',
      title: 'Team Collaboration',
      desc: 'Share files and collaborate seamlessly with your team members.',
    },
    {
      icon: 'briefcase',
      title: 'Project Management',
      desc: 'Attach and manage project files in one centralized place.',
    },
    {
      icon: 'cloud',
      title: 'Backup & Archiving',
      desc: 'Securely backup and archive important files in Dropbox.',
    },
    {
      icon: 'globe',
      title: 'Remote Access',
      desc: 'Access files anytime, anywhere from any device.',
    },
  ];

  readonly aboutChecklist = [
    'File Storage & Access',
    'Real-time Synchronization',
    'File Sharing & Collaboration',
    'Version History',
    'Search & Preview Files',
  ];
  readonly requirements = [
    'Dropbox Account',
    'Dropbox API access (via App)',
    'Internet connection',
  ];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
