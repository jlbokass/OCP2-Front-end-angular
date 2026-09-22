import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // THEN: the static landing page component is available.
    expect(component).toBeTruthy();
  });

  it('should expose the three primary navigation links', () => {
    // GIVEN: the homepage is rendered.
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a')
    ) as HTMLAnchorElement[];

    // THEN: login, registration and student access are present.
    const hrefs = links.map(link => link.getAttribute('href'));

    expect(hrefs).toContain('/login');
    expect(hrefs).toContain('/register');
    expect(hrefs).toContain('/students');
  });
});
