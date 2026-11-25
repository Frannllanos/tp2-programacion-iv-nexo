import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[appAdminAccent]', standalone: true })
export class AdminAccentDirective {
  @Input() appAdminAccent: string | null | undefined;

  @HostBinding('class.admin-accent')
  get esAdmin(): boolean {
    return this.appAdminAccent === 'administrador';
  }
}
