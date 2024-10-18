import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([])

  eLength = effect(()=> console.log('cat',this.cartItems().length))

  cartCount = computed(()=>this.cartItems().reduce((acc,item)=>acc + item.quantity,0))
  subTotal = computed(()=>this.cartItems().reduce((acc,item)=> (item.quantity * item.product.price) + acc,0))
  deliveryFee = computed(()=>this.subTotal()<50? 5.99:0);
  tax = computed(()=>Math.round(this.subTotal() *10.75/100))

  totalPrice = computed(()=>this.subTotal()+ this.deliveryFee() + this.tax())

  addToCart(product:Product):void {
   this.cartItems.update(val => [...val, {product,quantity:1}])
   //this.cartItems().push({product,quantity:1}) // si trabajo asi el efect no toma el cambio
  }

  updatedQuantity(cartItem:CartItem, quantity:number){
    this.cartItems.update((current)=>
      current.map(item => (item.product.id === cartItem.product.id) ? { ...item,quantity:quantity} : item )
    )
  }

  deleteElement(cartItem:CartItem){
    this.cartItems.update(current=>
      current.filter(cart => cart.product.id !== cartItem.product.id)
    )
  }
}
