var recorderObj = null;

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
            path: './song.mp4'
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

    document.getElementById('saveEffect').addEventListener('click', function () {
        saveAudio(sound)
    });


    document.getElementById('stopSave').addEventListener('click', function () {
        stopSave(sound)
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

function saveAudio() {
    const ctx = Pizzicato.context
    const source = Pizzicato.masterGainNode
    source.disconnect(ctx.destination)
    const dest = ctx.createMediaStreamDestination()
    source.connect(dest)
    const recorder = new Recorder(source)

    recorderObj = recorder;
    recorder.record()
    console.log(recorder)
}

function stopSave() {
    console.log(recorderObj)
    recorderObj.stop()

    const ctx = Pizzicato.context
    const source = Pizzicato.masterGainNode
    source.connect(ctx.destination)
    createDownloadLink()
}

function createDownloadLink() {
    recorderObj && recorderObj.exportWAV(function(blob) {
      var url = URL.createObjectURL(blob);
      var li = document.createElement('li');
      var au = document.createElement('audio');
      var hf = document.createElement('a');
      var recordingslist = document.getElementById('recordingslist');
      
      au.controls = true;
      au.src = url;
      hf.href = url;
      hf.download = new Date().toISOString() + '.wav';
      hf.innerHTML = hf.download;
      li.appendChild(au);
      li.appendChild(hf);
      recordingslist.appendChild(li);
    });
  }