import {Pipe, PipeTransform} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';

@Pipe({
  name: 'profileInitial'
})
export class ProfileInitialPipe implements PipeTransform { // FIXME DONE
  public transform(profile: KeycloakProfile | null): string {
    return profile?.firstName?.charAt(0) ?? '';
  }

}
