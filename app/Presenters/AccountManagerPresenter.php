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

                if ($data["action"] == "addNew") {
                    if (!preg_match('/^\pL+$/u', $user)) {
                        $this->sendJson(['resp' => "Uživatelské jméno může obsahovat pouze písmena"]);
                     }

                    $global = file_get_contents('../storage/global.json');
                    $global = json_decode($global, true);
                    $id = $global["user"];
                    $global["user"] = $global["user"] + 1;

                    $json[$id]['username'] = $user;
                    $json[$id]['password'] = $data['password'];
                    $json[$id]['manageUsers'] = $data['isAdmin'];
                    $json[$id]['notes'] = [];
                    $json[$id]['tags'] = [];

                    $json = json_encode($json, JSON_PRETTY_PRINT);
                    file_put_contents('../storage/data.json', $json);

                    $global = json_encode($global, JSON_PRETTY_PRINT);
                    file_put_contents('../storage/global.json', $global);
        
                    $this->sendJson(['resp' => "done"]);
                } else if ($data["action"] == "delete") {

                    if ($data["username"] == "admin") {
                        $this->sendJson(['resp' => "Nelze smazat uživatele admin"]);
                    }

                    unset($json[$user]);
                    $json = json_encode($json, JSON_PRETTY_PRINT);
                    file_put_contents('../storage/data.json', $json);

                    $this->sendJson(['resp' => "done"]);
                } else if ($data["action"] == "update") {

                    $id = $data["id"];

                    if (isset($json[$id])) {
                        $json[$id]['username'] = $user;
                        $json[$id]['password'] = $data['password'];
                        $json[$id]['manageUsers'] = $data['isAdmin'];
                        $json = json_encode($json, JSON_PRETTY_PRINT);
                        file_put_contents('../storage/data.json', $json);
                        $this->sendJson(['resp' => "done"]);
                    } else {
                        $this->sendJson(['resp' => "Tento uživatel neexistuje"]);
                    }
                }
            } else {
                $this->sendJson(['resp' => "Na toto nemáte oprávnění"]);
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
