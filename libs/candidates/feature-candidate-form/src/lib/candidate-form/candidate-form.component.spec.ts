
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CandidateFormComponent } from './candidate-form.component';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { CandidatesService } from '@org/candidates/data';
import { of } from 'rxjs';

describe('CandidateFormComponent', () => {
  let fixture: ComponentFixture<CandidateFormComponent>;
  let component: CandidateFormComponent;
  const mockStore = { dispatch: jest.fn() } as unknown as Store;
  const mockService = {
    createCandidate: jest.fn(),
    error: jest.fn(() => null),
  } as unknown as CandidatesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [CandidateFormComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: CandidatesService, useValue: mockService },
      ],
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
    
    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].nativeElement.textContent.trim()).toBe('Name is required');
    
    const fileError = fixture.debugElement.query(By.css('.file-validation-message.error'));
    expect(fileError.nativeElement.textContent.trim()).toBe('Excel file with user info is required');
  });

  it('should submit when valid', fakeAsync(() => {
    mockService.createCandidate = jest.fn().mockReturnValue(of({
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      years: 1,
      availability: true,
    }));

    const nameInput = fixture.debugElement.query(By.css('input[formControlName="name"]'));
    const surnameInput = fixture.debugElement.query(By.css('input[formControlName="surname"]'));
    nameInput.nativeElement.value = 'John';
    nameInput.nativeElement.dispatchEvent(new Event('input'));
    surnameInput.nativeElement.value = 'Doe';
    surnameInput.nativeElement.dispatchEvent(new Event('input'));
    component.excelFile = new File(['data'], 'test.xlsx');
    fixture.detectChanges();
    
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitBtn.nativeElement.click();
    fixture.detectChanges();
    
    expect(component.isLoading()).toBe(true);
    tick(1500);
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(component.submitStatus()).toBe('success');
  }));

  it('should dispatch and set success when service returns candidate', fakeAsync(() => {
    mockService.createCandidate = jest.fn().mockReturnValue(of({
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      years: 1,
      availability: true,
    }));

    const emitSpy = jest.spyOn(component.submittedSuccessfully, 'emit');
    component.form().setValue({ name: 'John', surname: 'Doe' });
    component.excelFile = new File(['data'], 'test.xlsx');

    component.onSubmit();
    expect(component.isLoading()).toBe(true);

    tick(1500);
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(component.submitStatus()).toBe('success');

    tick(2000);
    expect(component.submitStatus()).toBe('idle');
    expect(emitSpy).toHaveBeenCalled();
  }));

  it('should set error status and message when service fails', fakeAsync(() => {
    mockService.createCandidate = jest.fn().mockReturnValue(of({ success: false, error: { message: 'boom' } } as any));
    (mockService as any).error.mockReturnValue(null);

    component.form().setValue({ name: 'John', surname: 'Doe' });
    component.excelFile = new File(['data'], 'test.xlsx');

    component.onSubmit();
    tick(1500);

    expect(component.submitStatus()).toBe('error');
    expect(component.errorMessage()).toContain('boom');
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  }));
});
