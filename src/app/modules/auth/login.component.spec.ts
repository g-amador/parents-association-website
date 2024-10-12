import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: ActivatedRoute;

  beforeEach(async () => {
    // Create a mock AuthService
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    // Create a mock Router
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // Provide a mock ActivatedRoute with query parameters
    activatedRouteMock = {
      snapshot: {
        queryParams: {
          returnUrl: '/home'
        }
      }
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on form submit', async () => {
    authServiceMock.login.and.returnValue(Promise.resolve(true));

    const mockForm = {
      value: {
        email: 'test@example.com',
        password: 'password123'
      }
    };

    await component.onSubmit(mockForm);

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should navigate to returnUrl on successful login', async () => {
    authServiceMock.login.and.returnValue(Promise.resolve(true));

    const mockForm = {
      value: {
        email: 'test@example.com',
        password: 'password123'
      }
    };

    await component.onSubmit(mockForm);

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('should set loginFailed to true on unsuccessful login', async () => {
    authServiceMock.login.and.returnValue(Promise.resolve(false));

    const mockForm = {
      value: {
        email: 'test@example.com',
        password: 'wrongpassword'
      }
    };

    await component.onSubmit(mockForm);

    expect(component.loginFailed).toBe(true);
  });
});
