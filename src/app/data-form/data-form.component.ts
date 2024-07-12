import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {

    this.formulario = this.formBuilder.group({
      nome: [null,Validators.required],
      email: [null, [Validators.required, Validators.email]],
    });
    
   }

  ngOnInit(): void {
    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    });*/

  }

  onSubmit(){
    console.log(this.formulario);

    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe( dados => {
        console.log(dados)
        this.formulario.reset();
      
      },
     (error: any) => alert('erro'));
  }
  
  verificaValidTouched(campo: any){
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
    
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if(campoEmail?.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo: any){
    return {
      'is-invalid' : this.verificaValidTouched(campo),
      'is-valid' : !this.verificaValidTouched(campo) && !this.formulario.get(campo)?.pristine
    }
  }



  resetar(){
    this.formulario.reset();
  }

}
