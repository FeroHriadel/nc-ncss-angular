import { Component } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { RouterLink } from '@angular/router';
import { Button } from '../../ncss/buttons/button/button.component';
import { ListIcon, ButtonIcon, TextIcon } from '../../ncss/icons';




@Component({
  selector: 'inputs-page',
  imports: [Select, Card, Container, RouterLink, Button, ListIcon, ButtonIcon, TextIcon],
  templateUrl: './inputs.page.html',
  styleUrl: './inputs.page.css',
})



export class InputsPage {

}