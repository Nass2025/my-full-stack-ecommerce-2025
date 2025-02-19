import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ShopFormService} from '../../services/shop-form.service';
@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup: FormGroup;
   totalPrice: number = 0;
   totalQuantity: number = 0 ;
   creditCardMonths:number[] = [];
   creditCardYears: number[] = [];

  constructor(private fromBuilder:FormBuilder, private shopFormService: ShopFormService) {

    this.checkoutFormGroup = this.fromBuilder.group({
      customer: this.fromBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress:this.fromBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipcode:['']
      }),
      billingAddress:this.fromBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipcode:['']
      }),
      creditCard:this.fromBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:['']
      })
    });
  }

  ngOnInit(): void {

    let currentMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(currentMonth).subscribe(data => this.creditCardMonths = data);
    this.shopFormService.getCreditCardYears().subscribe(data => this.creditCardYears = data);

  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup.get('creditCard')?.value);

  }

  copyShippingToBilling(event: Event) {
    const checkbox = (event.target as HTMLInputElement).checked;
    if (checkbox) {
      this.checkoutFormGroup.get("billingAddress")?.setValue(this.checkoutFormGroup.get("shippingAddress")?.value);
    }else
      this.checkoutFormGroup.get("billingAddress")?.reset();
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");
    const currentYear: number = new Date().getFullYear();
    const selectedYear:number = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear)
      startMonth = new Date().getMonth() + 1;
    else
      startMonth = 1;
    console.log(startMonth);
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);

  }
}
