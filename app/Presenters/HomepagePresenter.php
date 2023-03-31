<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;


final class HomepagePresenter extends Nette\Application\UI\Presenter
{

    public function renderDefault(): void
    {

        if ($this->isAjax()) {

            $rqdata = $this->getHttpRequest()->getRawBody();
            $rqdata = json_decode($rqdata, true);

            $data = file_get_contents('../storage/data.json');
            $data = json_decode($data, true);
            $global = file_get_contents('../storage/global.json');
            $global = json_decode($global, true);

            $action = $rqdata["action"];

            if ($action == "create") {

                $title = $rqdata['title'];
                $text = $rqdata['text'];
                $color = $rqdata['color'];
                $author = $rqdata['author'];


                $id = $global['notes'];
                $data["notes"][$id] = array(
                    'title' => $title,
                    'text' => $text,
                    'color' => $color,
                    'author' => $author,
                    'timestamp' => date('Y-m-d H:i:s')
                );

                $global['notes'] = $id + 1;

                $resp = $data["notes"][$id];
                $resp['id'] = $id;
            } else if ($action == "delete") {
                $id = $rqdata['id'];
                unset($data["notes"][$id]);
                $resp = array('status' => 'done');
            } else if ($action == "edit") {
                $id = $rqdata['id'];
                $title = $rqdata['title'];
                $text = $rqdata['text'];
                $color = $rqdata['color'];
                $author = $rqdata['author'];

                if (!isset($data["notes"][$id])) {
                    $this->sendJson(array('status' => 'error', "msg" => "Note not found"));
                }

                $data["notes"][$id] = array(
                    'title' => $title,
                    'text' => $text,
                    'color' => $color,
                    'author' => $author,
                    'timestamp' => date('Y-m-d H:i:s')
                );

                $resp = $data["notes"][$id];
            }

            $global = json_encode($global, JSON_PRETTY_PRINT);
            $data = json_encode($data, JSON_PRETTY_PRINT);
            file_put_contents('../storage/global.json', $global);
            file_put_contents('../storage/data.json', $data);

            $this->sendJson($resp);
        }

        //render without ajax
        $data = file_get_contents('../storage/data.json');
        $data = json_decode($data, true);
        $this->template->notes = $data["notes"];
    }
}
