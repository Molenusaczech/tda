<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\Application\UI\Form;

function saveBackup($backupname, $user): string
{
    $backup = array();

    $file = file_get_contents('../storage/data.json');
    $file = json_decode($file, true);

    $notes = $file[$user]["notes"];

    //file_put_contents('../backups/'.$user."/".$backupname.'.csv', "");
    if (!file_exists('../backups/' . $user)) {
        mkdir('../backups/' . $user);
    }
    $fp = fopen('../backups/' . $user . "/" . $backupname . '.csv', 'wb');

    fputcsv($fp, array('id', 'date', 'lenght', 'lang', 'rating', 'description'));

    foreach ($notes as $id => $note) {
        $temp = array(
            $id,
            $note["date"],
            $note["lenght"],
            $note["lang"],
            $note["rating"],
            $note["description"],
        );
        fputcsv($fp, $temp);
    }

    //fputcsv($fp, array('tag_id', 'name', 'color'));
    //$backup = json_encode($backup, JSON_PRETTY_PRINT);
    //file_put_contents('../backups/'.$backupname.'.json', $backup);
    fclose($fp);

    $id = "/backupdownload/" . $backupname;

    return $id; 
}

function loadBackup($backupname, $user, $backupNow): void
{
    $backup = array();

    $file = file_get_contents('../storage/data.json');
    $file = json_decode($file, true);

    $backupname = str_replace("/backupdownload/", "", $backupname);

    $backupFile = file('../backups/' . $user . "/" . $backupname . '.csv');

    if ($backupNow) {
        saveBackup("onLoad_backup_" . time() * 1000, $user);
    }

    unset($backupFile[0]);

    foreach ($backupFile as $ln => $line) {

        $exploded = str_getcsv($line);
        $id = $exploded[0];
        $description = $exploded[5];
        $date = $exploded[1];
        $lang = $exploded[3];
        $lenght = $exploded[2];
        $rating = $exploded[4];


        $backup["notes"][$id] = array(
            "description" => $description,
            "date" => $date,
            "lang" => $lang,
            "lenght" => $lenght,
            "rating" => $rating,
            "tags" => array()
        );
    }
    $file[$user]["notes"] = $backup["notes"];

    $file = json_encode($file, JSON_PRETTY_PRINT);
    file_put_contents('../storage/data.json', $file);
}

function deleteBackup($backupname, $user): void
{
    $backupname = str_replace("/backupdownload/", "", $backupname);
    unlink('../backups/' . $user . "/" . $backupname . '.csv');
}

final class BackupManagerPresenter extends Nette\Application\UI\Presenter
{

    protected function createComponentCreateBackupForm(): Form
    {
        $form = new Form;
        $form->addUpload("file", "Záloha");
        $form->addSubmit('send', 'Nahrát zálohu');
        $form->onSuccess[] = [$this, 'createBackupFormSent'];
        return $form;
    }

    // callable function for saving backup

    public function createBackupFormSent(Form $form, $data): void
    {
        $user = $_SESSION['user'];
        $file = $data->file;

        if (preg_match("/.csv$/", $file->getName())) {

            if (!file_exists('../backups/' . $user)) {
                mkdir('../backups/' . $user);
            }

            //$this->flashMessage(var_dump($file));

            $content = file($file->getTemporaryFile());

            if (trim($content[0]) != "id,date,lenght,lang,rating,description") {
                $this->flashMessage('Špatný formát souboru');
                $this->redirect('BackupManager:');
                return;
            }

            unset($content[0]);

            foreach ($content as $ln => $line) {

                $exploded = str_getcsv(trim($line));
                if (count($exploded) != 6) {
                    $this->flashMessage('Špatný formát souboru');
                    $this->redirect('BackupManager:');
                    return;
                }

                for ($i = 0; $i < 6; $i++) {
                    if (!isset($exploded[$i]) || $exploded[$i] == "") {
                        $this->flashMessage('Špatný formát souboru');
                        $this->redirect('BackupManager:');
                        return;
                    }
                }
            }


            $time = time() * 1000;
            $filename = "upload_backup_" . $time . ".csv";


            $file->move('../backups/' . $user . "/" . $filename);
            $this->redirect('BackupManager:');
        } else {
            $this->flashMessage('Špatný formát souboru');
        }
    }

    public function renderDefault(): void
    {

        if ($this->IsAjax()) {
            $data = $this->getHttpRequest()->getRawBody();
            $data = json_decode($data, true);
            $user = $_SESSION['user'];

            $global = file_get_contents('../storage/global.json');
            $global = json_decode($global, true);

            $file = file_get_contents('../storage/data.json');
            $file = json_decode($file, true);

            if ($data["action"] == "createBackup") {
                $backupname = $data["name"];

                $name = saveBackup($backupname, $user);

                $exploded = explode("_", str_replace("/backupdownload/", "", $name));

                $trueName = $exploded[0];
                $time = (int)$exploded[2];
                $time = date("Y-m-d H:i:s", (int)floor($time / 1000));

                $this->sendJson(['resp' => "done", "name" => $name, "title" => $trueName, "time" => $time]);
            } else if ($data["action"] == "restoreBackup") {
                loadBackup($data["name"], $user, $data["createBackup"]);
                $this->sendJson(['resp' => "done"]);
            } else if ($data["action"] == "deleteBackup") {
                deleteBackup($data["name"], $user);
                $this->sendJson(['resp' => "done"]);
            } else if ($data["action"] == "renameBackup") {
                $backupname = $data["name"];
                $newName = $data["newName"];

                $exploded = explode("_", $newName);

                $name = "/backupdownload/" . $newName;
                $trueName = $exploded[0];
                $time = (int)$exploded[2];
                $time = date("Y-m-d H:i:s", (int)floor($time / 1000));

                $backupname = str_replace("/backupdownload/", "", $backupname);
                rename('../backups/' . $user . "/" . $backupname . '.csv', '../backups/' . $user . "/" . $newName . '.csv');
                $this->sendJson(['resp' => "done", "name" => $name, "title" => $trueName, "time" => $time]);
            }
        }

        if (!isset($_SESSION['user'])) {
            $this->redirect('Login:');
        }

        $user = $_SESSION['user'];
        $backups = array_diff(scandir('../backups/' . $user), array('..', '.'));
        $finalBackups = array();

        foreach ($backups as $backup) {
            $backup = str_replace(".csv", "", $backup);
            $name = $backup;
            $split = explode("_", $backup);
            $time = (int)$split[2];
            $time = $time / 1000;
            $time = date("Y-m-d H:i:s", (int)$time);
            $backup = array(
                "name" => $split[0],
                "time" => $time,
                "id" => "/backupdownload/" . $name
            );
            array_push($finalBackups, $backup);
        }
        $this->template->backups = $finalBackups;
    }

    public function renderDownload(): void
    {
        $user = $_SESSION['user'];

        $backup = $this->getParameter('id');
        $url = '../backups/' . $user . '/' . $backup . '.csv';

        $file = file_get_contents('../storage/data.json');
        $file = json_decode($file, true);
        $username = $file[$user]["username"];

        $name = $username . "-" . date("Y-m-d") . '.csv';

        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $name . '"');
        header('Content-Length: ' . filesize($url));
        header('Pragma: public');
        flush();
        readfile($url);

        echo $backup;
        die();
    }
}
