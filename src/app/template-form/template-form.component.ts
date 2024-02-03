import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit(form: any){
    console.log(form)
    //console.log(this.usuario)
  }

  consultaCEP(cep: string){
    cep = cep.replace(/\D/g, '');
    console.log(cep)
    if(cep){
      var validacep = /^[0-9]{8}$/;
      if(validacep.test(cep)) {
        this.http.get(`https://viacep.com.br/ws/${cep}/json`).subscribe(
          dados => {
            console.log(dados);
          }
        );
      }
    } else {
      console.log('vazio ou nulo')
    }
  }

  verificaValidTouched(campo: any){
    return !campo.valid && campo.touched;
  }


  aplicaCssErro(campo: any){
    return {
      'was-validated': this.verificaValidTouched(campo)
    }
  }

}
