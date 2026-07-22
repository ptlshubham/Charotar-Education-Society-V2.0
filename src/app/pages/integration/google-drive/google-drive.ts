import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-google-drive-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './google-drive.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './google-drive.scss',
})
export class GoogleDriveIntegration {
  readonly heroChecklist = [
    'Store and organize files in Google Drive',
    'Access files directly within ZarklyX',
    'Collaborate and share files with your team',
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
      value: '24.8K',
      change: '18.6%',
      color: '#00AC47',
      points: '0,13 8,10 16,12 24,7 32,9 40,4 48,6',
    },
    {
      label: 'Files Shared',
      value: '8.6K',
      change: '21.4%',
      color: '#C587CE',
      points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3',
    },
    {
      label: 'Storage Used',
      value: '156 GB',
      change: '16.2%',
      color: '#2684FC',
      points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4',
    },
    {
      label: 'Team Collaborations',
      value: '3.2K',
      change: '19.7%',
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
      color: '#00AC47',
      title: 'File Storage & Access',
      desc: 'Store all your important files in Google Drive and access them instantly from ZarklyX.',
    },
    {
      icon: 'sync',
      color: '#2684FC',
      title: 'Real-time Sync',
      desc: 'Automatically sync files and updates in real-time across platforms.',
    },
    {
      icon: 'shield',
      color: '#C587CE',
      title: 'Secure & Reliable',
      desc: "Enterprise-grade security with Google Drive's trusted infrastructure.",
    },
    {
      icon: 'users',
      color: '#E8A33D',
      title: 'File Sharing & Permissions',
      desc: 'Share files and folders with team members and manage permissions effortlessly.',
    },
    {
      icon: 'history',
      color: '#E8A33D',
      title: 'Version History',
      desc: 'Keep track of file versions and restore previous versions when needed.',
    },
    {
      icon: 'search',
      color: '#3DAFA9',
      title: 'Search & Preview',
      desc: 'Search, preview, and open files directly inside ZarklyX.',
    },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'plug', title: '1. Connect', desc: 'Connect your Google account securely.' },
    {
      icon: 'folder',
      title: '2. Select & Authorize',
      desc: 'Select Google Drive and grant the required permissions.',
    },
    {
      icon: 'sync',
      title: '3. Sync Files',
      desc: "We'll sync your files and folders to make them available in ZarklyX.",
    },
    {
      icon: 'share',
      title: '4. Manage & Share',
      desc: 'Access, manage, and share files with your team seamlessly.',
    },
    {
      icon: 'chart',
      title: '5. Collaborate',
      desc: 'Work together and boost productivity across your workflows.',
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
      desc: 'Securely backup and archive important files in Google Drive.',
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
    'Secure Sharing & Permissions',
    'Version History',
    'Search & Preview Files',
  ];
  readonly requirements = [
    'Google Account',
    'Google Drive access permission',
    'Internet connection',
  ];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
