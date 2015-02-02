$(function () {
    var oscillator;
    var amp;
    var $book = $('#book'),
        $read = $('#read'),
        $state = $('#state');

    function initAudio() {
        oscillator = audioContext.createOscillator();
        fixOscillator(oscillator);
        oscillator.frequency.value = 440;
        amp = audioContext.createGain();
        amp.gain.value = 0;

        oscillator.connect(amp);
        amp.connect(audioContext.destination);
        oscillator.start(0);
    }
    initAudio();

    function startTone( frequency ) {
        var now = audioContext.currentTime;
        
        oscillator.frequency.setValueAtTime(frequency, now);

        amp.gain.cancelScheduledValues(now);
        amp.gain.setValueAtTime(amp.gain.value, now);
        amp.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    }

    function stopTone() {
        var now = audioContext.currentTime;
        amp.gain.cancelScheduledValues(now);
        amp.gain.setValueAtTime(amp.gain.value, now);
        amp.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 1.0);
    }
    Math.log = (function() {
      var log = Math.log;
      return function(n, base) {
        return log(n)/(base ? log(base) : 1);
      };
    })();


    
    $read.on('click', function() {
        var input = $book.val(),
            pos = 0;
        (function(){
            function readChar() {
                var code = input.charCodeAt(pos),
                    frequency = 0,
                    state = '';
                stopTone();
                if (pos >= input.length) {
                    $state.empty();
                    return;
                }
                if (code >= 65 && code <= 90) {
                    frequency = Math.log(code - 65 + 2, 32) * 530 + 500;
                }
                if (code >= 97 && code <= 122) {
                    frequency = Math.log(code - 97 + 2, 32) * 500 + 500;
                }
                if (frequency !== 0) {
                    startTone(Math.floor(frequency));
                }
                for (var i = 0; i < input.length; i++) {
                    if (i === pos) {
                        state += "<span>" + input[i] + "</span>";
                    } else {
                        state += input[i];
                    }
                }
                $state.html(state);
                console.log("[" + input[pos] + "]\tcode: " + code + "\tfrequency: " + frequency + "");
                pos++;
                setTimeout(function(){
                    setTimeout(function(){
                        readChar();
                    }, 100);
                }, 50);
            }
            readChar();
        })();
    });
});