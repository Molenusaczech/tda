<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\Application\UI\Form;

final class LoginPresenter extends Nette\Application\UI\Presenter
{

    protected function createComponentLoginForm(): Form
	{
		$form = new Form;
		$form->addText('name', '')
        -> setHtmlAttribute('placeholder', 'Username');
		$form->addPassword('password', '')
        -> setHtmlAttribute('placeholder', 'Password');
		$form->addSubmit('send', 'Sign in');
		$form->onSuccess[] = [$this, 'loginFormSent'];
		return $form;
	}

	public function loginFormSent(Form $form, $data): void
	{
		// here we will process the data sent by the form
		// $data->name contains name
		// $data->password contains password

        /*
		$this->flashMessage('You have successfully signed up.');
		$this->redirect('Homepage:');*/

        $file = file_get_contents('../storage/data.json');
        $file = json_decode($file, true);

        /*if ($file[$data->name]['password'] == $data->password) {
            //$this->flashMessage('You have successfully signed up.');
            $_SESSION['user'] = $data->name;
            $this->redirect('Homepage:');
        } else {
            $this->flashMessage('Špatné jméno nebo heslo');
        }*/

        $authed = false;

        foreach ($file as $id => $udata) {
            if ($udata['username'] == $data->name && $udata['password'] == $data->password) {
                $authed = true;
                $_SESSION['user'] = $id;
                $this->redirect('Homepage:');
            }
        }

        if (!$authed) {
            $this->flashMessage('Špatné jméno nebo heslo');
        }
	}

    public function renderDefault(): void
    {
        $file = file_get_contents('../storage/data.json');
        $file = json_decode($file, true);
        if (isset($_SESSION['user']) && isset($file[$_SESSION['user']])) {
            $this->redirect('Homepage:');
        }
    }

    public function actionLogout(): void
    {
        unset($_SESSION['user']);
        $this->redirect('Homepage:');
    }


}
