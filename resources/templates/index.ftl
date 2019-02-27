<#-- @ftlvariable name="turn" type="com.thmatuza.oms.server.ktor.sample.TurnModel" -->

<html>

<head>
    <title>Intel&reg; Collaboration Suite for WebRTC Conference Sample</title>
</head>

<body>
<div class="local" style="width:320px;height:240px">
    <video autoplay muted playsinline style="width:320px;height:240px"></video>
</div>
<div id="resolutions"><span>Try a different resolution:&nbsp;</span></div>
<div class="remote">
    <video autoplay controls playsinline></video>
</div>
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js" type="text/javascript"></script>
<script src="https://webrtchacks.github.io/adapter/adapter-7.0.0.js" type="text/javascript"></script>
<script src="scripts/oms.js" type="text/javascript"></script>
<script type="text/javascript">
    var config = {
        rtcConfiguration: {
            iceServers: [{
                urls: [
                    "stun:stun.l.google.com:19302"
                ]
            }, {
                urls: [
                    "turn:${turn.host}:${turn.port}?transport=udp"
                ],
                credential: "${turn.password}",
                username: "${turn.username}"
            }]
        }
    };
</script>
<script src="scripts/index.js" type="text/javascript"></script>
<script src="scripts/rest-sample.js" type="text/javascript"></script>
<script language="JavaScript">
    function getParameterByName(name) {
        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(
            /\+/g, ' '));
    }

    runSocketIOSample();
</script>
</body>

</html>