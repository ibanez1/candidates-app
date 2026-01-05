
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateFormComponent } from './candidate-form.component';
import { By } from '@angular/platform-browser';

describe('CandidateFormComponent', () => {
  let fixture: ComponentFixture<CandidateFormComponent>;
  let component: CandidateFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the form', () => {
    const nameInput = fixture.debugElement.query(By.css('input[formControlName="name"]'));
    const surnameInput = fixture.debugElement.query(By.css('input[formControlName="surname"]'));
    expect(nameInput).toBeTruthy();
    expect(surnameInput).toBeTruthy();
  });

  it('should show required errors when submitting empty', () => {
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitBtn.nativeElement.click();
    fixture.detectChanges();
    const nameError = fixture.debugElement.query(By.css('.error'));
    expect(nameError.nativeElement.textContent).toContain('Name is required');
    const surnameError = fixture.debugElement.queryAll(By.css('.error'))[1];
    expect(surnameError.nativeElement.textContent).toContain('Surname is required');
  });

  it('should submit when valid', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {return});
    const nameInput = fixture.debugElement.query(By.css('input[formControlName="name"]'));
    const surnameInput = fixture.debugElement.query(By.css('input[formControlName="surname"]'));
    nameInput.nativeElement.value = 'John';
    nameInput.nativeElement.dispatchEvent(new Event('input'));
    surnameInput.nativeElement.value = 'Doe';
    surnameInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitBtn.nativeElement.click();
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('John'));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Doe'));
  });
});
