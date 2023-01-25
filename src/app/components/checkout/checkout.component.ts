import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MyformService } from 'src/app/services/myform.service';
import { MyFormValidators } from 'src/app/validators/my-form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private myformservice: MyformService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
      }),
      shippingAddress: this.formBuilder.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
      }),
      billingAddress: this.formBuilder.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
      }),
      creditCard: this.formBuilder.group({
        cardType: ['', Validators.required],
        nameOnCard: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        cardNumber: [
          '',
          [
            Validators.required,
            Validators.pattern('[0-9]{16}'),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        securityCode: [
          '',
          [
            Validators.required,
            Validators.pattern('[0-9]{3}'),
            MyFormValidators.notOnlyWhitespace,
          ],
        ],
        expirationMonth: ['', Validators.required],
        expirationYear: ['', Validators.required],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.myformservice.getCrediCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
    this.myformservice.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    });

    this.myformservice.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.reviewCardDetails();
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    // let orderItems: OrderItem[] = [];
    // for (let i = 0; i < cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    let orderItems: OrderItem[] = cartItems.map(
      (cartItemTemp) => new OrderItem(cartItemTemp)
    );

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    //populate purchase -- shipping Address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase -- billing Address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;

    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItem = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(`Your Tracking number is ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.billingAddressStates = this.shippingAddressStates;
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
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
      this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryId = formGroup?.value.country;
    this.myformservice.getStates(countryId).subscribe((data) => {
      if (formGroupName === 'shippingAddress')
        this.shippingAddressStates = data;
      else this.billingAddressStates = data;
    });
  }
  reviewCardDetails() {
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
  }
}
