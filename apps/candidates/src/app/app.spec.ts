import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { appRoutes } from './app.routes';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should have title property set to "Candidates Tool"', () => {
    expect(component.title).toBe('Candidates Tool');
  });

  it('should render title in header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.app-header h1');
    expect(header).toBeTruthy();
    expect(header?.textContent?.trim()).toBe('Candidates Tool');
  });

  it('should have app-header with container', () => {
    const header = fixture.nativeElement.querySelector('.app-header');
    expect(header).toBeTruthy();
    const container = header?.querySelector('.container');
    expect(container).toBeTruthy();
  });

  it('should have main section with app-main class', () => {
    const main = fixture.nativeElement.querySelector('.app-main');
    expect(main).toBeTruthy();
    expect(main?.tagName).toBe('MAIN');
  });

  it('should render footer with correct copyright', () => {
    const footer = fixture.nativeElement.querySelector('.app-footer');
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain('© 2025 Candidates Tool - Alejandro Ibáñez');
  });

  it('should render footer with technology stack information', () => {
    const footer = fixture.nativeElement.querySelector('.app-footer');
    expect(footer?.textContent).toContain('Frontend (Angular) + Backend (NestJS) + Shared Libraries');
  });

  it('should have footer with container', () => {
    const footer = fixture.nativeElement.querySelector('.app-footer .container');
    expect(footer).toBeTruthy();
  });

  it('should have router outlet for dynamic content', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should apply change detection strategy OnPush', () => {
    const metadata = (App as unknown as { ɵcmp: { onPush: boolean } })['ɵcmp'];
    expect(metadata.onPush).toBeTruthy();
  });
});
