<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;

function getRecord($id, $user)
{
    $file = file_get_contents('../storage/data.json');
    $file = json_decode($file, true);
    //$record = $file[$user]["notes"][$id];
    if (!isset($file[$user]["notes"][$id])) {
        return null;
    }
    $final = array();
    $final["id"] = $id;
    $final["date"] = Date("Y-m-d", strtotime($file[$user]["notes"][$id]["date"]));
    $final["time-spent"] = $file[$user]["notes"][$id]["lenght"];
    $final["programming-language"] = $file[$user]["notes"][$id]["lang"];
    $final["rating"] = (int)$file[$user]["notes"][$id]["rating"];
    $final["description"] = $file[$user]["notes"][$id]["description"];
    return $final;
}

function deleteRecord($id, $user)
{
    $file = file_get_contents('../storage/data.json');
    $file = json_decode($file, true);
    if (!isset($file[$user]["notes"][$id])) {
        return null;
    }
    unset($file[$user]["notes"][$id]);
    $file = json_encode($file, JSON_PRETTY_PRINT);
    file_put_contents('../storage/data.json', $file);
    return true;
}

function updateRecord($id, $user, $body) {
    $file = file_get_contents('../storage/data.json');
    $file = json_decode($file, true);
    if (!isset($file[$user]["notes"][$id])) {
        return null;
    }

    if (!preg_match('/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/', $body["date"])) {
        return false;
    }

    if ($body['time-spent'] < 0) {
        return false;
    }

    if ($body['rating'] < 0 || $body['rating'] > 5) {
        return false;
    }

    if (strlen($body['programming-language']) > 1000) {
        return false;
    }

    $newid = $body["id"];
    $date = $body["date"]."T00:01";
    $lenght = $body["time-spent"];
    $lang = $body["programming-language"];
    $rating = $body["rating"];
    $description = $body["description"];

    unset($file[$user]["notes"][$id]);

    $file[$user]["notes"]["$newid"] = [
        "description" => $description,
        "date" => $date,
        "lang" => $lang,
        "lenght" => $lenght,
        "rating" => $rating,
    ];


    $file = json_encode($file, JSON_PRETTY_PRINT);
    file_put_contents('../storage/data.json', $file);

    $resp = array();
    $file = file_get_contents('../storage/data.json');
    $file = json_decode($file, true);

    $resp["id"] = $newid;
    $resp["date"] = Date("Y-m-d", strtotime($file[$user]["notes"][$newid]["date"]));
    $resp["time-spent"] = $file[$user]["notes"][$newid]["lenght"];
    $resp["programming-language"] = $file[$user]["notes"][$newid]["lang"];
    $resp["rating"] = (int)$file[$user]["notes"][$newid]["rating"];
    $resp["description"] = $file[$user]["notes"][$newid]["description"];
    return $resp;
}

final class ApiPresenter extends Nette\Application\UI\Presenter
{

    public function renderDefault(): void
    {
        $userid = $this->getParameter('user_id');
        $recordid = $this->getParameter('record_id');
        switch ($_SERVER['REQUEST_METHOD']) {
            case "GET":
                $resp = getRecord($recordid, $userid);
                if ($resp == null) {
                    http_response_code(404);
                    $this->sendPayload();
                } else {
                    http_response_code(200);
                    $this->sendJson($resp);
                }
                break;
            case "DELETE":
                $resp = deleteRecord($recordid, $userid);
                if ($resp == null) {
                    http_response_code(404);
                    $this->sendPayload();
                } else {
                    http_response_code(200);
                    $this->sendPayload();
                }
                break;
            case "PUT":
                // get request body
                $body = json_decode(file_get_contents('php://input'), true);
                $resp = updateRecord($recordid, $userid, $body);
                if ($resp == null) {
                    http_response_code(404);
                    $this->sendPayload();
                } else if ($resp == false) {
                    http_response_code(422);
                    $this->sendPayload();
                } else{
                    http_response_code(200);
                    $this->sendJson($resp);
                }

        }
    }
}
