import { Component } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { RouterLink } from '@angular/router';
import { Button } from '../../ncss/buttons/button/button.component';
import { ListIcon, ButtonIcon, TextIcon, CheckboxIcon, UserAddIcon, UserEditIcon, UserIcon, UserDeleteIcon, HamburgerIcon } from '../../ncss/icons';
import { Checkbox } from '../../ncss/inputs/checkbox/checkbox.component';
import { Switch } from '../../ncss/inputs/switch/switch.component';
import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
import { Password } from '../../ncss/inputs/password/password.component';




@Component({
  selector: 'inputs-page',
  imports: [Select, Card, Container, RouterLink, Button, ListIcon, ButtonIcon, TextIcon, CheckboxIcon, Checkbox, Switch, SquareButton, Password, UserAddIcon, UserEditIcon, UserIcon, UserDeleteIcon, HamburgerIcon],
  templateUrl: './inputs.page.html',
  styleUrl: './inputs.page.css',
})



export class InputsPage {

}