# TDA Diary

# Dovysvětlení našeho pochopení rozšíření

Zelené rozšíření jsme pochopili jako login systém. Programátory jsme pochopili jako uživatelské účty. Mělo by to všechny body splňovat.

## Default login:
Username: admin
Password: heslo

## Lokální spuštění

Prerekvizity

#### Windows
- Nainstalovaný [WSL2 (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install)
- Nainstalovaný a běžící [Docker](https://www.docker.com/)

#### Linux / MacOS
- Nainstalovaný a běžící [Docker](https://www.docker.com/)

```
    docker build . -t tda-nette
    docker run -p 8080:80 -v ${pwd}:/app tda-nette
```


Aplikace bude následně přístupná na `http://localhost:8080`

