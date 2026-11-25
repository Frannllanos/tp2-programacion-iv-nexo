import { Directive, HostBinding, HostListener, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Directive({ selector: '[appNavegable]', standalone: true })
export class NavegableDirective {
  private readonly router = inject(Router);

  @Input({ required: true }) appNavegable!: string | any[];

  @HostBinding('attr.tabindex') tabindex = 0;
  @HostBinding('attr.role') role = 'link';
  @HostBinding('class.navegable') navegable = true;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select, label')) return;
    void this.ir();
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeydown(event: Event): void {
    event.preventDefault();
    void this.ir();
  }

  private ir(): Promise<boolean> {
    return Array.isArray(this.appNavegable)
      ? this.router.navigate(this.appNavegable)
      : this.router.navigateByUrl(this.appNavegable);
  }
}
