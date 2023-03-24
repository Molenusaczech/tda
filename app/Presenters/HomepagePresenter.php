<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;


final class HomepagePresenter extends Nette\Application\UI\Presenter
{

    public function renderDefault(): void
    {
        
        if (isset($_SESSION['user'])) {
            $this->template->user = $_SESSION['user'];
        } else {
            $this->redirect('Login:');
        }

        if ($this->IsAjax()) {
            //$this->sendJson(['resp' => "done", "id" => "1"]);
            $data = $this->getHttpRequest()->getRawBody();
            $data = json_decode($data, true);
            if ($data["action"] == "add") {
                $global = file_get_contents('../storage/global.json');
                $global = json_decode($global, true);
                $id = $global["id"];
                $global["id"] = $global["id"] + 1;

                $file = file_get_contents('../storage/data.json');
                $file = json_decode($file, true);
                $user = $_SESSION['user'];

                $description = $data["description"];
                $date = $data["date"];
                $lang = $data["lang"];
                $lenght = $data["lenght"];
                $rating = $data["rating"];
                $tags = $data["tags"];

                $file[$user]["notes"]["$id"] = [
                    "description" => $description,
                    "date" => $date,
                    "lang" => $lang,
                    "lenght" => $lenght,
                    "rating" => $rating,
                    "tags" => $tags
                ];

                $file = json_encode($file, JSON_PRETTY_PRINT);
                file_put_contents('../storage/data.json', $file);

                $global = json_encode($global, JSON_PRETTY_PRINT);
                file_put_contents('../storage/global.json', $global);

                $this->sendJson(['resp' => "done", "id" => $id]);
                

            } else if ($data["action"] == "delete") {
                $id = $data["id"];
                $file = file_get_contents('../storage/data.json');
                $file = json_decode($file, true);
                $user = $_SESSION['user'];
                unset($file[$user]["notes"][$id]);
                $file = json_encode($file, JSON_PRETTY_PRINT);
                file_put_contents('../storage/data.json', $file);
                $this->sendJson(['resp' => "done", "id" => $id]);
            } else if ($data["action"] == "edit") {
                $id = $data["id"];
                $file = file_get_contents('../storage/data.json');
                $file = json_decode($file, true);
                $user = $_SESSION['user'];
                $description = $data["description"];
                $date = $data["date"];
                $lang = $data["lang"];
                $lenght = $data["lenght"];
                $rating = $data["rating"];
                $tags = $data["tags"];

                $file[$user]["notes"]["$id"] = [
                    "description" => $description,
                    "date" => $date,
                    "lang" => $lang,
                    "lenght" => $lenght,
                    "rating" => $rating,
                    "tags" => $tags
                ];

                $file = json_encode($file, JSON_PRETTY_PRINT);
                file_put_contents('../storage/data.json', $file);
                $this->sendJson(['resp' => "done", "id" => $id]);
            } else if ($data["action"] == "addTag") {
                $global = file_get_contents('../storage/global.json');
                $global = json_decode($global, true);
                $id = $global["tag"];
                $global["tag"] = $global["tag"] + 1;

                $file = file_get_contents('../storage/data.json');
                $file = json_decode($file, true);
                $user = $_SESSION['user'];

                $color = $data["color"];
                $name = $data["name"];

                $file[$user]["tags"]["$id"] = [
                    "color" => $color,
                    "name" => $name
                ];

                $file = json_encode($file, JSON_PRETTY_PRINT);
                file_put_contents('../storage/data.json', $file);

                $global = json_encode($global, JSON_PRETTY_PRINT);
                file_put_contents('../storage/global.json', $global);

                $this->sendJson(['resp' => "done", "id" => $id]);
            } else if ($data["action"] == "editTag") {
                $id = $data["id"];
                $file = file_get_contents('../storage/data.json');
                $file = json_decode($file, true);
                $user = $_SESSION['user'];
                $color = $data["color"];
                $name = $data["name"];

                $file[$user]["tags"]["$id"] = [
                    "color" => $color,
                    "name" => $name
                ];

                $file = json_encode($file, JSON_PRETTY_PRINT);
                file_put_contents('../storage/data.json', $file);
                $this->sendJson(['resp' => "done", "id" => $id]);
            } else if ($data["action"] == "deleteTag") {
                //delete tag
                $id = $data["id"];
                $file = file_get_contents('../storage/data.json');
                $file = json_decode($file, true);
                $user = $_SESSION['user'];
                unset($file[$user]["tags"][$id]);
                foreach ($file[$user]["notes"] as $key => $value) {
                    if (in_array($id, $value["tags"])) {
                        $akey = array_search($id, $value["tags"]);
                        unset($file[$user]["notes"][$key]["tags"][$akey]);
                    }
                }
                $file = json_encode($file, JSON_PRETTY_PRINT);
                file_put_contents('../storage/data.json', $file);
                $this->sendJson(['resp' => "done", "id" => $id]);
            }
        }

        $data = file_get_contents('../storage/data.json');
        $data = json_decode($data, true);

        $user = $_SESSION['user'];

        if (!isset($data[$user])) {
            unset($_SESSION['user']);
            $this->redirect('Homepage:');
        }

        $notes = $data[$_SESSION['user']]['notes'];
        $tags = $data[$_SESSION['user']]['tags'];
        $isAdmin = $data[$_SESSION['user']]['manageUsers'];;

        //$user = $_SESSION['user'];

        


        $finalNotes = array();

        $maxtime = 0;
        $mintime = 9999999999999999;
        $langlist = array();
        $maxlenght = 0;
        $minlenght = 9999999999999999;
        $minrating = 9999999999999999;
        $maxrating = 0;
        
        foreach ($notes as $index => $note) {
            $finalNotes[$index] = $note;

            $finalNotes[$index]['date'] = date("d.m.Y h:m", strtotime($note['date']));

            $tagtext = "";
            /*
            foreach ($note['tags'] as $index2 => $tag) {
                
                $color = $tags[$tag]['color'];

                $tagtext = $tagtext."data-tags-$tag ";

                $finalNotes[$index]['tags'][$index2] = array(
                    'name' => $tags[$tag]['name'],
                    'color' => "background-color:".$color,
                    'id' => $tag
                );
                

                $index2++;
            }*/
            $finalNotes[$index]['tags'] = array();

            $timestamp = strtotime("".$note["date"]."");
            $timestamp++;

            if ($timestamp > strtotime("".$maxtime."")) {
                //$maxtime = $timestamp;
                $date = date("Y-m-d", $timestamp);
                $time = date("H:i", $timestamp);
                $maxtime = $date."T".$time;
            }

            if ($timestamp < strtotime("".$mintime."")) {
                //$mintime = $timestamp;
                $date = date("Y-m-d", $timestamp);
                $time = date("H:i", $timestamp);
                $mintime = $date."T".$time;
            }

            if (!in_array($note["lang"], $langlist)) {
                array_push($langlist, $note["lang"]);
            }

            $lenght = $note["lenght"];
            if ($lenght > $maxlenght) {
                $maxlenght = $note["lenght"];
            }

            if ($lenght < $minlenght) {
                $minlenght = $note["lenght"];
            }

            $rating = $note["rating"];
            if ($rating < $minrating) {
                $minrating = $note["rating"];
            }

            if ($rating > $maxrating) {
                $maxrating = $note["rating"];
            }	

            $finalNotes[$index]['data'] = 'data-date='.$note["date"]." data-desc=".$note["description"]." data-lang=".$note["lang"]." data-lenght=".$note["lenght"]." data-rating=".$note["rating"]." data-timestamp=".$timestamp." ".$tagtext;
            

            //$index++;
        }
        
        $filters = array(
            'maxtime' => $maxtime,
            'mintime' => $mintime,
            'langlist' => $langlist,
            'maxlenght' => $maxlenght,
            'minlenght' => $minlenght,
            'minrating' => $minrating,
            'maxrating' => $maxrating
        );
        
        $this->template->filters = $filters;
        $this->template->notes = $finalNotes;


        foreach ($tags as $id => $tag) {
            $tags[$id]["style"] = "background-color: ".$tags[$id]["color"];
        }
        

        $this->template->tags = array();
        $this->template->admin = $isAdmin;

    }


}
