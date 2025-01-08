import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-be-a-member',
  templateUrl: './be-a-member.component.html',
  styleUrls: ['./be-a-member.component.scss']
})
export class BeAMemberComponent implements OnInit {
  membershipForm!: FormGroup;
  dropdownOpen = false;
  selectedOption = '+351';  // Default selected country code
  selectedFlagClass = 'fi fi-pt';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.membershipForm = this.fb.group({
      name: ['', Validators.required],
      father: [false],
      father_in_law: [false],
      mother: [false],
      mother_in_law: [false],
      legal_guardian: [false],
      phone: ['', Validators.required],
      countryCode: ['+351', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      childName1: ['', Validators.required],
      year1: ['', Validators.required],
      class1: ['', Validators.required],
      dataPolicy: [false],
      thirdParty: [false],
      emailNotices: [false],
      collaboration: [false],
      date: ['', Validators.required],
    }, { validators: this.atLeastOneChecked });
  }

  // Custom validator for ensuring that at least one checkbox is checked
  atLeastOneChecked(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as FormGroup;
    const checkboxes = [
      formGroup.get('father')?.value,
      formGroup.get('father_in_law')?.value,
      formGroup.get('mother')?.value,
      formGroup.get('mother_in_law')?.value,
      formGroup.get('legal_guardian')?.value
    ];
    if (checkboxes.some(value => value === true)) {
      return null; // At least one checkbox is checked
    } else {
      return { atLeastOneRequired: true }; // Error if none are checked
    }
  }

  onSubmit(): void {
    if (this.membershipForm.valid) {
      const formData = this.membershipForm.value;

      const subject = encodeURIComponent('Parents Home Association Membership');
      const body = encodeURIComponent(`
        Name: ${formData.name}
        Father: ${formData.father ? 'Yes' : 'No'}
        Father in law: ${formData.father_in_law ? 'Yes' : 'No'}
        Mother: ${formData.mother ? 'Yes' : 'No'}
        Mother in law: ${formData.mother_in_law ? 'Yes' : 'No'}
        Legal Guardian: ${formData.legal_guardian ? 'Yes' : 'No'}
        Phone: ${formData.countryCode} ${formData.phone}
        Email: ${formData.email}
        Address: ${formData.address}
        Child's Name: ${formData.childName1}
        Year: ${formData.year1}
        Class: ${formData.class1}
        Data Policy Accepted: ${formData.dataPolicy ? 'Yes' : 'No'}
        Third Party Consent: ${formData.thirdParty ? 'Yes' : 'No'}
        Email Notices: ${formData.emailNotices ? 'Yes' : 'No'}
        Collaboration: ${formData.collaboration ? 'Yes' : 'No'}
        Date: ${formData.date}
      `);

      const mailtoLink = `mailto:association@example.com?subject=${subject}&body=${body}`;

      // Create an anchor element
      window.location.href = mailtoLink; // Opens the default mail client
    } else {
      console.log('Form is invalid');
    }
  }

  options = [
    { value: '+1', flagClass: 'fi fi-us' },  // United States
    { value: '+44', flagClass: 'fi fi-gb' },  // United Kingdom
    { value: '+33', flagClass: 'fi fi-fr' },  // France
    { value: '+49', flagClass: 'fi fi-de' },  // Germany
    { value: '+34', flagClass: 'fi fi-es' },  // Spain
    { value: '+351', flagClass: 'fi fi-pt' }, // Portugal
    { value: '+39', flagClass: 'fi fi-it' },  // Italy
    { value: '+61', flagClass: 'fi fi-au' },  // Australia
    { value: '+81', flagClass: 'fi fi-jp' },  // Japan
    { value: '+55', flagClass: 'fi fi-br' },  // Brazil
    { value: '+91', flagClass: 'fi fi-in' },  // India
    { value: '+7', flagClass: 'fi fi-ru' },   // Russia
    { value: '+52', flagClass: 'fi fi-mx' },  // Mexico
    { value: '+86', flagClass: 'fi fi-cn' },  // China
    { value: '+27', flagClass: 'fi fi-za' },  // South Africa
    { value: '+971', flagClass: 'fi fi-ae' }, // United Arab Emirates
    { value: '+1', flagClass: 'fi fi-ca' },   // Canada
    { value: '+20', flagClass: 'fi fi-eg' },  // Egypt
    { value: '+34', flagClass: 'fi fi-es' },  // Spain
    { value: '+66', flagClass: 'fi fi-th' },  // Thailand
    { value: '+41', flagClass: 'fi fi-ch' },  // Switzerland
    { value: '+31', flagClass: 'fi fi-nl' },  // Netherlands
    { value: '+47', flagClass: 'fi fi-no' },  // Norway
    { value: '+32', flagClass: 'fi fi-be' },  // Belgium
    { value: '+61', flagClass: 'fi fi-au' },  // Australia
    { value: '+43', flagClass: 'fi fi-at' },  // Austria
    { value: '+46', flagClass: 'fi fi-se' },  // Sweden
    { value: '+48', flagClass: 'fi fi-pl' },  // Poland
    { value: '+351', flagClass: 'fi fi-pt' }, // Portugal
    { value: '+91', flagClass: 'fi fi-in' },  // India
    { value: '+92', flagClass: 'fi fi-pk' },  // Pakistan
    { value: '+20', flagClass: 'fi fi-eg' },  // Egypt
    { value: '+65', flagClass: 'fi fi-sg' },  // Singapore
    { value: '+82', flagClass: 'fi fi-kr' },  // South Korea
    { value: '+20', flagClass: 'fi fi-eg' },  // Egypt
  ];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: any) {
    this.selectedOption = option.value;
    this.selectedFlagClass = option.flagClass;
    this.dropdownOpen = false;
    // Sync the selected option with the form control
    this.membershipForm.get('countryCode')?.setValue(option.value);
  }
}
