import { Injectable } from '@angular/core';
import { PersonaNaturalAfiliacion } from 'src/app/utiils/types';

@Injectable({
  providedIn: 'root'
})
export class DtoService {

  private personaNatural: Partial<PersonaNaturalAfiliacion> = {} ;
  private tcAccepted = false;

  constructor() { 
    //empty
  }

  patchPersonaNatural(personaNatural: Partial<PersonaNaturalAfiliacion>){
    this.personaNatural = {...this.personaNatural, ...personaNatural};
  }

  clearPersonaNatural(){
    this.personaNatural = {};
    return this.personaNatural; 
  }

  getPersonaNatural(): Partial<PersonaNaturalAfiliacion> {
    return this.personaNatural;
  }

  setTcAccepted(){
    this.tcAccepted = true;
  }

  itWasAccepted(){
    return this.tcAccepted;
  }


}
