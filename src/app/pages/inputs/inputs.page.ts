import { Component } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { RouterLink } from '@angular/router';
import { Button } from '../../ncss/buttons/button/button.component';
import { UploadIcon, ListIcon, ButtonIcon, TextIcon, CheckboxIcon, UserAddIcon, UserEditIcon, UserIcon, UserDeleteIcon, HamburgerIcon, ToolsIcon } from '../../ncss/icons';
import { Checkbox } from '../../ncss/inputs/checkbox/checkbox.component';
import { Switch } from '../../ncss/inputs/switch/switch.component';
import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
import { Password } from '../../ncss/inputs/password/password.component';
import { FileUpload } from '../../ncss/inputs/file-upload/file-upload.component';




@Component({
  selector: 'inputs-page',
  imports: [Select, Card, Container, RouterLink, Button, UploadIcon, ListIcon, ButtonIcon, TextIcon, CheckboxIcon, Checkbox, Switch, SquareButton, Password, FileUpload, UserAddIcon, UserEditIcon, UserIcon, UserDeleteIcon, HamburgerIcon, ToolsIcon],
  templateUrl: './inputs.page.html',
  styleUrl: './inputs.page.css',
})



export class InputsPage {

}