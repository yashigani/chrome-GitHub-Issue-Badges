interface Config {
    origin?: string,
    apiRoot?: string,
    token?: string,
}

function getTextArea(): HTMLTextAreaElement {
    let elm = document.querySelector('.configuration') as HTMLTextAreaElement;
    return elm;
}

function getConfigurations(elm: HTMLTextAreaElement) {
    let text = elm.value;
    let configurations = JSON.parse(text);
    return configurations;
}

function fillInConfig(elm: HTMLTextAreaElement, configs: any[]) {
    let json = JSON.stringify(configs, null, '  ');
    elm.value = json;
}

function testToken(config: Config): Promise<string> {
    if (config === undefined) {
        return;
    } else {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", config.apiRoot);
            xhr.setRequestHeader("Authorization", `token ${config.token}`)
            xhr.onload = (r) => {
                if (xhr.status === 200) {
                    resolve(config.origin);
                } else {
                    reject(config.origin);
                }
            };
            xhr.onerror = (e) => {
                reject(config.origin);
            };
            xhr.send();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let defaultConfigurations = '[{"origin":"https://github.com","apiRoot":"https://api.github.com","token":"input your access token"}]';
    let configs: any[] = JSON.parse(localStorage.getItem('origins') || defaultConfigurations);
    fillInConfig(getTextArea(), configs);

    document.querySelector('.save-button').addEventListener('click', function(e) {
        let configurations = getConfigurations(getTextArea());
        localStorage.setItem('origins', JSON.stringify(configurations));
        alert('saved')
    });

    document.querySelector('.test-button').addEventListener('click', (button) => {
        let configurations = getConfigurations(getTextArea());
        Promise.all(configurations.map((c: Config) => testToken(c)))
            .then((promises) => {
                alert('all ok');
            })
            .catch((e) => {
                alert('ng: ' + e);
            });
    });
});
