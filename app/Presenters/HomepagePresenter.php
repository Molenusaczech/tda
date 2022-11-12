<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;


final class HomepagePresenter extends Nette\Application\UI\Presenter
{

    public function renderDefault(): void
    {
        $data = file_get_contents('../storage/placeholderdata.json');
        $data = json_decode($data, true);

        $notes = $data['notes'];
        $tags = $data['tags'];

        $finalNotes = array();

        $index = 0;
        foreach ($notes as $note) {
            $finalNotes[$index] = $note;
            $finalNotes[$index]['data'] = 'data-note-date='.$note["date"];

            $index2 = 0;
            foreach ($note['tags'] as $tag) {
                
                $color = $tags[$tag]['color'];

                $finalNotes[$index]['tags'][$index2] = array(
                    'name' => $tag,
                    'style' => 'background-color: '.$color
                );
                

                $index2++;
            }

            $index++;
        }

        $this->template->notes = $finalNotes;

    }


}
