<?php

declare(strict_types=1);

namespace App\Router;

use Nette;
use Nette\Application\Routers\RouteList;


final class RouterFactory
{
	use Nette\StaticClass;

	public static function createRouter(): RouteList
	{
		$router = new RouteList;
		$router->addRoute('<presenter>/<action>[/<id>]', 'Homepage:default');
		$router->addRoute('login[/<id>]', 'Login:default');
		$router->addRoute('accountmanager[/<id>]', 'AccountManager:default');
		$router->addRoute('backupmanager[/<id>]', 'BackupManager:default');
		$router->addRoute('backupdownload/<id>', 'BackupManager:download');
		$router->addRoute('users/<user_id>/records/<record_id>', 'Api:default');
		return $router;
	}
}
