import {Pipe, PipeTransform} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';

@Pipe({
  name: 'profileFullname'
})
export class ProfileFullnamePipe implements PipeTransform { // FIXME DONE
  public transform(profile: KeycloakProfile | null): string {
    return `${profile?.firstName} ${profile?.lastName}`;
  }

}
