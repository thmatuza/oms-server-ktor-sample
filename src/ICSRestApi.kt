package com.thmatuza.oms.server.ktor.sample

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.client.HttpClient
import io.ktor.client.call.call
import io.ktor.client.engine.apache.Apache
import io.ktor.client.features.BadResponseStatusException
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.header
import io.ktor.client.response.readText
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import kotlinx.serialization.Serializable
import org.apache.commons.codec.binary.Base64
import org.apache.commons.codec.binary.Hex
import java.security.SecureRandom
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import kotlin.experimental.and

typealias ErrorHandler = suspend (HttpStatusCode, String) -> Unit


class ICSRestApi(private val service: String, val key: String, var url: String) {
    val version = "v1"
    private val mapper = jacksonObjectMapper()

    init {
        url = if (url.endsWith("/")) "$url$version/" else "$url/$version/"
    }

    data class GetRoomsOption(
        val page: Int?,
        val perPage: Int?
    )

    @Serializable
    private data class RoomRequest(
        val name: String,
        val options: Room
    )

    @Serializable
    private data class StreamingInRequest(
        val connection: StreamingInConnectionOptions,
        val media: StreamingInMediaOptions
    ) {
        @Serializable
        data class StreamingInConnectionOptions(
            val url: String,
            val transportProtocol: TransportProtocol,
            val bufferSize: Int
        )
    }

    data class StreamingInTransportOptions(
        val protocol: TransportProtocol = TransportProtocol.TCP,
        val bufferSize: Int = 2048
    )

    @Serializable
    data class StreamingInMediaOptions(
        val video: Any = "auto",
        val audio: Any = "auto"
    )

    @Serializable
    private data class StreamingOutRequest(
        val url: String,
        val media: MediaSubOptions
    )

    @Serializable
    private data class RecordingRequest(
        val container: RecordingContainer,
        val media: MediaSubOptions
    )

    @Serializable
    private data class TokensRequest(
        val preference: Preference,
        val user: String,
        val role: String
    )

    private fun calculateSignature(toSign: String, key: String): String {
        val algorithm = "HmacSHA256"
        val keySpec = SecretKeySpec(key.toByteArray(), algorithm)
        val mac = Mac.getInstance(algorithm)
        mac.init(keySpec)
        val hash = mac.doFinal(toSign.toByteArray())
            .joinToString("") { String.format("%02x", it and 255.toByte()) }
        return Base64.encodeBase64String(hash.toByteArray())
    }

    private suspend fun send(
        httpMethod: io.ktor.http.HttpMethod,
        resource: String,
        reqBody: Any?,
        onOK: suspend (result: String) -> Unit,
        onError: ErrorHandler?
    ) {
        val timestamp = System.currentTimeMillis().toString()
        val random = SecureRandom()
        val bytes = ByteArray(8)
        random.nextBytes(bytes)
        val cnounce = Hex.encodeHexString(bytes)

        val toSign = "$timestamp,$cnounce"
        var authheader = "MAuth realm=http://marte3.dit.upm.es,mauth_signature_method=HMAC_SHA256"

        val signed = calculateSignature(toSign, key)

        authheader += ",mauth_serviceid=$service,mauth_cnonce=$cnounce,mauth_timestamp=$timestamp,mauth_signature=$signed"

        val client = HttpClient(Apache) {
            install(JsonFeature) {
                serializer = JacksonSerializer {
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                }
            }
        }

        try {
            val call = client.call(url + resource) {
                method = httpMethod
                header("Authorization", authheader)
                if (reqBody != null) {
                    contentType(ContentType.Application.Json)
                    body = reqBody
                }
            }
            onOK(call.response.readText())
        } catch (e: BadResponseStatusException) {
            onError?.invoke(e.statusCode, e.response.readText())
        } catch (e: Exception) {
            onError?.invoke(HttpStatusCode.BadRequest, e.toString())
        }
    }

    suspend fun createRoom(
        name: String,
        options: Room,
        callback: suspend (room: Room) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(
            HttpMethod.Post, "rooms", RoomRequest(
                name = name,
                options = options
            ), { roomRtn ->
                callback(mapper.readValue(roomRtn))
            }, callbackError
        )
    }

    suspend fun getRooms(
        options: GetRoomsOption,
        callback: suspend (rooms: List<Room>) -> Unit,
        callbackError: ErrorHandler?
    ) {
        val page = options.page ?: 1
        val perPage = options.perPage ?: 50
        val query = "?page=$page&per_page=$perPage"
        send(HttpMethod.Get, "rooms$query", null, { roomsRtn ->
            callback(mapper.readValue(roomsRtn))
        }, callbackError)
    }

    suspend fun getRoom(room: String, callback: suspend (room: Room) -> Unit, callbackError: ErrorHandler) {
        if (room.isBlank()) {
            return callbackError(HttpStatusCode.Unauthorized, "Empty room ID")
        }
        send(HttpMethod.Get, "rooms/$room", null, { roomRtn ->
            callback(mapper.readValue(roomRtn))
        }, callbackError)
    }

    suspend fun deleteRoom(room: String, callback: suspend (room: String) -> Unit, callbackError: ErrorHandler) {
        send(HttpMethod.Delete, "rooms/$room", null, { result ->
            callback(result)
        }, callbackError)
    }

    suspend fun updateRoom(
        room: String,
        options: Room,
        callback: suspend (room: Room) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(HttpMethod.Put, "rooms/$room", options, { roomRtn ->
            callback(mapper.readValue(roomRtn))
        }, callbackError)
    }

    suspend fun updateRoomPartially(
        room: String,
        items: List<RoomUpdate>,
        callback: suspend (room: Room) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(HttpMethod.Patch, "rooms/$room", items, { roomRtn ->
            callback(mapper.readValue(roomRtn))
        }, callbackError)
    }

    suspend fun getParticipants(
        room: String,
        callback: suspend (participants: List<ParticipantDetail>) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(HttpMethod.Get, "rooms/$room/participants/", null, { participantsRtn ->
            callback(mapper.readValue(participantsRtn))
        }, callbackError)
    }

    suspend fun getParticipant(
        room: String,
        participant: String,
        callback: suspend (participant: ParticipantDetail) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (participant.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid participant ID")
        }
        send(HttpMethod.Get, "rooms/$room/participants/$participant", null, { participantRtn ->
            callback(mapper.readValue(participantRtn))
        }, callbackError)
    }

    suspend fun updateParticipant(
        room: String,
        participant: String,
        items: List<PermissionUpdate>,
        callback: suspend (participant: ParticipantDetail) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (participant.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid participant ID")
        }
        send(HttpMethod.Patch, "rooms/$room/participants/$participant", items, { participantRtn ->
            callback(mapper.readValue(participantRtn))
        }, callbackError)
    }

    suspend fun dropParticipant(
        room: String,
        participant: String,
        callback: suspend (participant: String) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (participant.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid participant ID")
        }
        send(HttpMethod.Delete, "rooms/$room/participants/$participant", null, { result ->
            callback(result)
        }, callbackError)
    }

    suspend fun getStreams(
        room: String,
        callback: suspend (streams: List<StreamInfo>) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(HttpMethod.Get, "rooms/$room/streams/", null, { streamsRtn ->
            callback(mapper.readValue(streamsRtn))
        }, callbackError)
    }

    suspend fun getStream(
        room: String,
        stream: String,
        callback: suspend (stream: StreamInfo) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (stream.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid stream ID")
        }
        send(HttpMethod.Get, "rooms/$room/streams/$stream", null, { streamRtn ->
            callback(mapper.readValue(streamRtn))
        }, callbackError)
    }

    suspend fun updateStream(
        room: String,
        stream: String,
        items: List<StreamInfoUpdate>,
        callback: suspend (stream: StreamInfo) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(HttpMethod.Patch, "rooms/$room/streams/$stream", items, { streamRtn ->
            callback(mapper.readValue(streamRtn))
        }, callbackError)
    }

    suspend fun deleteStream(
        room: String,
        stream: String,
        callback: suspend (result: String) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (stream.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid stream ID")
        }
        send(HttpMethod.Delete, "rooms/$room/streams/$stream", null, { result ->
            callback(result)
        }, callbackError)
    }

    suspend fun startStreamingIn(
        room: String,
        url: String,
        transport: StreamingInTransportOptions,
        media: StreamingInMediaOptions,
        callback: suspend (stream: StreamInfo) -> Unit,
        callbackError: ErrorHandler
    ) {
        val pubReq = StreamingInRequest(
            connection = StreamingInRequest.StreamingInConnectionOptions(
                url = url,
                transportProtocol = transport.protocol,
                bufferSize = transport.bufferSize
            ),
            media = media
        )
        send(HttpMethod.Post, "rooms/$room/streaming-ins/", pubReq, { streamRtn ->
            callback(mapper.readValue(streamRtn))
        }, callbackError)
    }

    suspend fun stopStreamingIn(
        room: String,
        stream: String,
        callback: suspend (result: String) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (stream.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid stream ID")
        }
        send(HttpMethod.Delete, "rooms/$room/streaming-ins/$stream", null, { result ->
            callback(result)
        }, callbackError)
    }

    suspend fun getStreamingOuts(
        room: String,
        callback: suspend (streamingOutList: List<StreamingOut>) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(HttpMethod.Get, "rooms/$room/streaming-outs/", null, { streamingOutList ->
            callback(mapper.readValue(streamingOutList))
        }, callbackError)
    }

    suspend fun startStreamingOut(
        room: String,
        url: String,
        media: MediaSubOptions,
        callback: suspend (streamingOut: StreamingOut) -> Unit,
        callbackError: ErrorHandler
    ) {
        val options = StreamingOutRequest(
            url = url,
            media = media
        )

        send(HttpMethod.Post, "rooms/$room/streaming-outs/", options, { streamingOutRtn ->
            callback(mapper.readValue(streamingOutRtn))
        }, callbackError)
    }

    suspend fun updateStreamingOut(
        room: String,
        id: String,
        items: List<SubscriptionControlInfo>,
        callback: suspend (streamingOut: StreamingOut) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (id.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid streamingOut ID")
        }
        send(HttpMethod.Patch, "rooms/$room/streaming-outs/$id", items, { streamingOutRtn ->
            callback(mapper.readValue(streamingOutRtn))
        }, callbackError)
    }

    suspend fun stopStreamingOut(
        room: String,
        id: String,
        callback: suspend (result: String) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (id.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid streamingOut ID")
        }
        send(HttpMethod.Delete, "rooms/$room/streaming-outs/$id", null, { result ->
            callback(result)
        }, callbackError)
    }

    suspend fun getRecordings(
        room: String,
        callback: suspend (recording: List<Recordings>) -> Unit,
        callbackError: ErrorHandler
    ) {
        send(HttpMethod.Get, "rooms/$room/recordings/", null, { recordingList ->
            callback(mapper.readValue(recordingList))
        }, callbackError)
    }

    suspend fun startRecording(
        room: String,
        container: RecordingContainer,
        media: MediaSubOptions,
        callback: suspend (recording: Recordings) -> Unit,
        callbackError: ErrorHandler
    ) {
        val options = RecordingRequest(
            container = container,
            media = media
        )

        send(HttpMethod.Post, "rooms/$room/recordings/", options, { recordingRtn ->
            callback(mapper.readValue(recordingRtn))
        }, callbackError)
    }

    suspend fun updateRecording(
        room: String,
        id: String,
        items: List<SubscriptionControlInfo>,
        callback: suspend (recording: Recordings) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (id.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid recording ID")
        }
        send(HttpMethod.Patch, "rooms/$room/recordings/$id", items, { recordingRtn ->
            callback(mapper.readValue(recordingRtn))
        }, callbackError)
    }

    suspend fun stopRecording(
        room: String,
        id: String,
        callback: suspend (result: String) -> Unit,
        callbackError: ErrorHandler
    ) {
        if (id.isBlank()) {
            return callbackError(HttpStatusCode.BadRequest, "Invalid recording ID")
        }
        send(HttpMethod.Delete, "rooms/$room/recordings/$id", null, { result ->
            callback(result)
        }, callbackError)
    }

    suspend fun createToken(
        room: String,
        user: String,
        role: String,
        preference: Preference,
        callback: suspend (result: String) -> Unit,
        callbackError: ErrorHandler?
    ) {
        send(
            HttpMethod.Post, "rooms/$room/tokens/", TokensRequest(
                preference = preference,
                user = user,
                role = role
            ), callback, callbackError
        )
    }
}