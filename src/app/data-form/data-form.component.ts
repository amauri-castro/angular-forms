import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DropdownService } from '../shared/services/dropdown.service';
import { Estado } from 'src/assets/models/estado';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;
  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService
  ) {

    this.formulario = this.formBuilder.group({
      nome: [null,Validators.required],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]

      })

    });
    
   }

  ngOnInit(): void {
    this.dropdownService.getEstadosBr().subscribe({
      next: (dados: Estado[]) => {
        this.estados = dados;
        console.log(dados)
      },
      error: (err: any) => {
        console.log(err);
      }
    })

  }

  consultaCEP(){
    let cep = this.formulario.get('endereco.cep')?.value;
    cep = cep.replace(/\D/g, '');
    console.log(cep)
    if(cep){
      var validacep = /^[0-9]{8}$/;
      if(validacep.test(cep)) {
        this.resetarFormulario();
        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
        .subscribe(
          dados => {
            this.populaDadosForm(dados)
            console.log(dados)
          } 
            
        );
      }
    } else {
      console.log('vazio ou nulo')
      
    }
  }

  onSubmit(){
    console.log(this.formulario);
    if(this.formulario.valid) {
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .subscribe( dados => {
          console.log(dados)
          this.formulario.reset();
        
        },
       (error: any) => alert('erro'));

    } else {
      console.log('formulario invalido');
      this.verificaValidacoesForm(this.formulario)
    }

  }

  verificaValidacoesForm(formgroup: FormGroup){
    Object.keys(formgroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formgroup.get(campo);
      controle?.markAsDirty();

      if(controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }
  
  verificaValidTouched(campo: string){
    return !this.formulario.get(campo)?.valid && (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty);
    
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if(campoEmail?.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo: string){
    return {
      'is-invalid' : this.verificaValidTouched(campo),
      'is-valid' : !this.verificaValidTouched(campo) && !this.formulario.get(campo)?.pristine
    }
  }


  populaDadosForm(dados:any){
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      }
    });
    //console.log(formulario)
  }

  resetarFormulario(){
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      }
    });
  }



  resetar(){
    this.formulario.reset();
  }

}
