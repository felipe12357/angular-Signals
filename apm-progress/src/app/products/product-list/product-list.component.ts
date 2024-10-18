import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription } from 'rxjs';


@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
    imports: [NgIf, NgFor, NgClass, ProductDetailComponent,AsyncPipe],
  
})
export class ProductListComponent {
   //implements OnInit, OnDestroy 
  // Just enough here for the template to compile
  pageTitle = 'Products';

  productsSignal = this.productService.productListResultS
  selectedProductIdS = this.productService.productSelectedIdS
  

  sub!:Subscription;
  constructor(private productService:ProductService){

  }

/*   ngOnInit(): void {
    //forma procedural (trabajo con variables normales)
    this.sub = this.productService.getProductList()
    .pipe( 
      //se recomienda utilizar esto en lugar de lo q se hizo en product detail component
      catchError(err =>{ 
        this.errorMessage =err;
        return EMPTY; //esto tambien retorna un observable
      })
    )
    .subscribe( data => this.products = data);
  } */

  /*  ngOnDestroy(): void {
    this.sub.unsubscribe()
  } */

  onSelected(productId: number): void {
    this.productService.setProductSelected(productId);
  }

  refresh(){
    this.productService.updateProductList();
  }
}
