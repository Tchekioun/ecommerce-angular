import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { MyformService } from 'src/app/services/myform.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const country_id = formGroup?.value.country;
    this.myformservice.getStates(country_id).subscribe((data) => {
      if (formGroupName === 'shippingAddress')
        this.shippingAddressStates = data;
      else this.billingAddressStates = data;
    });
  }
  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private myformservice: MyformService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        experationMonth: [''],
        expirationyear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log(`start month is ${startMonth}`);

    this.myformservice.getCrediCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
    this.myformservice.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    this.myformservice.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  onSubmit() {
    console.log('Handling the submition');
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationyear
    );
    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.myformservice.getCrediCardMonths(startMonth).subscribe((data) => {
      console.log(`YOU GOOD ${JSON.stringify(data)}`);
      this.creditCardMonths = data;
    });
  }
}
