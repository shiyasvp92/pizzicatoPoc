function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

window.onload = function () {
    let effectsList = {}

    loadJSON('./effects.json',
        function(data) { 
            effectsList = data;

            const eqSelector = document.getElementById('eqSelect');

            Object.keys(effectsList).forEach((elem) => {
                const option = document.createElement('option');
                option.value = elem;
                option.id = elem;
                option.innerText = elem;

                eqSelector.appendChild(option);
            })

        },
        function(xhr) { console.error(xhr); }
    );

    var sound = new Pizzicato.Sound({
        source: 'file',
        options: {
            path: './song.mp3'
        }
    });

    document.getElementById('eqSelect').addEventListener('change', function (e) {
        setEffect(e.target.value, sound, effectsList[e.target.value])
    });

    document.getElementById('playBtn').addEventListener('click', function () {
        sound.play(0, 10);
    });

    document.getElementById('stopBtn').addEventListener('click', function () {
        sound.stop();
    });
}

function setEffect(mode, sound, effectConf) {
    console.log(sound);

    sound.effects = []

    if(effectConf) {
        if(effectConf.compressor) {
            sound.addEffect(new Pizzicato.Effects.Compressor(
                effectConf.compressor
            ))
        }
    
        if(effectConf.highPass) {
            sound.addEffect(new Pizzicato.Effects.HighPassFilter(
                effectConf.highPass
            ))
        }
    
        if(effectConf.lowPass) {
            sound.addEffect(new Pizzicato.Effects.LowPassFilter(
                effectConf.lowPass
            ))
        }

        if(effectConf.reverb) {
            sound.addEffect(new Pizzicato.Effects.Reverb(
                effectConf.reverb
            ))
        }
        
    }

    if (sound.playing) {
        sound.stop()
        sound.play(0, 10)
    }
}

function printEffect(effect) {
    document.getElementById('currentEq').innerHTML = JSON.stringify(effect)
}