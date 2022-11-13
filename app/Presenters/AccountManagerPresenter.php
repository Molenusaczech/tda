<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\Application\UI\Form;

final class AccountManagerPresenter extends Nette\Application\UI\Presenter
{
    public function renderDefault(): void
    {
        
        if ($this->isAjax()) {
            //$this->template->result = 'any value';
            $author = $_SESSION['user'];
            $data = $this->getHttpRequest()->getRawBody();
            $data = json_decode($data, true);
            
            $file = file_get_contents('../storage/data.json');
            $json = json_decode($file, true);
            $user = $data["username"];

            if ($json[$author]["manageUsers"] == true) {

                $json[$user]['password'] = $data['password'];
                $json[$user]['manageUsers'] = $data['isAdmin'];

                $json = json_encode($json);
                file_put_contents('../storage/data.json', $json);
        
                $this->sendJson(['resp' => "done"]);
            } else {
                $this->sendJson(['resp' => "no perm"]);
            }
        }

        if (!isset($_SESSION['user'])) {
            $this->redirect('Login:');
        }

        $file = file_get_contents('../storage/data.json');
        $file = json_decode($file, true);

        if (!$file[$_SESSION['user']]['manageUsers']) {
            $this->redirect('Homepage:');
        }

        $this->template->users = $file;

    }


}
