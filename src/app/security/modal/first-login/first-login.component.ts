import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { matchValidator } from 'src/app/utiils/validator/match.validator';

@Component({
  selector: 'app-first-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
    InputTextModule
  ],
  standalone: true,
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.scss']
})
export class FirstLoginComponent implements OnInit {

  dni = ''

  constructor(private dialogRef: DynamicDialogConfig,
    private fb: FormBuilder) { }
  

  activeIndex = 0;

  stepThree() {
    this.activeIndex = 1;
  }

  stepFour() {
    this.activeIndex = 2;
  }

  stepFive() {

    this.activeIndex = 3;
  }

  ngOnInit(): void {

    this.dni = this.dialogRef.data.dni;

    this.form.get('dni')?.setValue(this.dni);
    
  }

  form = this.fb.group({
    dni: ['', [Validators.minLength(8), Validators.maxLength(8), Validators.required]],
    code: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  }, { validators: matchValidator('newPassword', 'confirmPassword') } as AbstractControlOptions);


}
