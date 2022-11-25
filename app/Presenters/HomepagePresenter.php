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
                $file = json_encode($file);
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



        $notes = $data[$_SESSION['user']]['notes'];
        $tags = $data[$_SESSION['user']]['tags'];

        //$user = $_SESSION['user'];

        


        $finalNotes = array();

        
        foreach ($notes as $index => $note) {
            $finalNotes[$index] = $note;

            $tagtext = "";

            foreach ($note['tags'] as $index2 => $tag) {
                
                $color = $tags[$tag]['color'];

                $tagtext = $tagtext."data-tags-$tag ";

                $finalNotes[$index]['tags'][$index2] = array(
                    'name' => $tags[$tag]['name'],
                    'color' => "background-color:".$color,
                    'id' => $tag
                );
                

                $index2++;
            }

            $finalNotes[$index]['data'] = 'data-date='.$note["date"]." data-desc=".$note["description"]." data-lang=".$note["lang"]." data-lenght=".$note["lenght"]." data-rating=".$note["rating"]." ".$tagtext;

            $index++;
        }

        $this->template->notes = array_reverse($finalNotes);


        foreach ($tags as $id => $tag) {
            $tags[$id]["style"] = "background-color: ".$tags[$id]["color"];
        }
        

        $this->template->tags = $tags;

    }


}
