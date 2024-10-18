import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { concatMap, map, mergeMap, of, Subscription, switchMap, tap } from 'rxjs';
import { ReviewService } from 'src/app/reviews/review.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe,AsyncPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy{

  sub!:Subscription;
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  private cartService = inject(CartService);

  productS = this.productService.singleProductResultS;

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  ngOnChanges(changes: SimpleChanges): void {

    //if(this.productId!==0){
        //Solucion cargando la responsabilidad en el servicio
       /*  this.sub =this.productService.getProductV2(this.productId)
        .subscribe({
          next: (val)=> this.product =val,
          error: (error)=>this.errorMessage =error //se recomienda utilizar el operador catch error (ver product list)
        }); */

        //Solucion cargando la responsabilidad en el componente
        /*  this.sub = this.productService.getProductFirstVersion(this.productId).pipe(
            concatMap((product:Product)=>{
              if(product.hasReviews)
                return this.reviewService.getReviewUrl(this.productId).pipe(
                  map((review) =>{
                    product.reviews = review
                    return product;
                  }),
                )
              
              return of(product);
            }),
            tap(val=>console.log(val))
        ) */
   // }
  }

  ngOnDestroy(): void {
   /*  if(this.sub)
      this.sub.unsubscribe() */
  }

}
