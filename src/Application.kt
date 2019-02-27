package com.thmatuza.oms.server.ktor.sample

import freemarker.cache.ClassTemplateLoader
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.ContentNegotiation
import io.ktor.freemarker.FreeMarker
import io.ktor.freemarker.FreeMarkerContent
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.resource
import io.ktor.http.content.resources
import io.ktor.http.content.static
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class PostRooms(
    val name: String,
    val options: Room
)

data class PostStreamingIn(
    val url: String,
    val transport: ICSRestApi.StreamingInTransportOptions,
    val media: ICSRestApi.StreamingInMediaOptions
)

data class PostStreamingOut(
    val url: String,
    val media: MediaSubOptions
)

data class PostRecording(
    val container: RecordingContainer,
    val media: MediaSubOptions
)

data class PostToken(
    val room: String?,
    val user: String,
    val role: String
)

data class CreateToken(
    val room: String?,
    val username: String,
    val role: String
)

val Application.icsService get() = environment.config.property("ics.service").getString()
val Application.icsKey get() = environment.config.property("ics.key").getString()
val Application.icsUri get() = environment.config.property("ics.uri").getString()
val Application.turnHost get() = environment.config.property("turn.host").getString()
val Application.turnPort get() = environment.config.property("turn.port").getString()
val Application.turnUsername get() = environment.config.property("turn.username").getString()
val Application.turnPassword get() = environment.config.property("turn.password").getString()

var sampleRoom: String? = null
    @Synchronized get
    @Synchronized set

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    val icsRestApi = ICSRestApi(icsService, icsKey, icsUri)
    val pageOption = ICSRestApi.GetRoomsOption(page = 1, perPage = 100)
    val turnModel = TurnModel(turnHost, turnPort, turnUsername, turnPassword)

    install(CORS)
    {
        method(HttpMethod.Put)
        method(HttpMethod.Patch)
        method(HttpMethod.Delete)
        method(HttpMethod.Options)
        header(HttpHeaders.Origin)
        anyHost()
    }
    install(ContentNegotiation) {
        jackson {
        }
    }
    install(FreeMarker) {
        templateLoader = ClassTemplateLoader(this::class.java.classLoader, "templates")
    }

    routing {
        options {
            call.respond(HttpStatusCode.OK)
        }

        post("/rooms") {
            val post = call.receive<PostRooms>()
            icsRestApi.createRoom(post.name, post.options, { response ->
                call.respond(response)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms") {
            icsRestApi.getRooms(pageOption, { rooms ->
                call.respond(rooms)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms/{room}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            icsRestApi.getRoom(room, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        put("/rooms/{room}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val config = call.receive<Room>()
            icsRestApi.updateRoom(room, config, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        patch("/rooms/{room}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val items = call.receive<List<RoomUpdate>>()
            icsRestApi.updateRoomPartially(room, items, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        delete("/rooms/{room}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            icsRestApi.deleteRoom(room, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms/{room}/participants") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            icsRestApi.getParticipants(room, { participants ->
                call.respond(participants)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms/{room}/participants/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val participantId =
                call.parameters["id"] ?: throw IllegalArgumentException("Parameter participantId not found")
            icsRestApi.getParticipant(room, participantId, { info ->
                call.respond(info)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        patch("/rooms/{room}/participants/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val participantId =
                call.parameters["id"] ?: throw IllegalArgumentException("Parameter participantId not found")
            val items = call.receive<List<PermissionUpdate>>()
            icsRestApi.updateParticipant(room, participantId, items, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        delete("/rooms/{room}/participants/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val participantId =
                call.parameters["id"] ?: throw IllegalArgumentException("Parameter participantId not found")
            icsRestApi.dropParticipant(room, participantId, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms/{room}/streams") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            icsRestApi.getStreams(room, { streams ->
                call.respond(streams)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms/{room}/streams/{stream}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val streamId = call.parameters["stream"] ?: throw IllegalArgumentException("Parameter streamId not found")
            icsRestApi.getStream(room, streamId, { info ->
                call.respond(info)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        patch("/rooms/{room}/streams/{stream}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val streamId = call.parameters["stream"] ?: throw IllegalArgumentException("Parameter streamId not found")
            val items = call.receive<List<StreamInfoUpdate>>()
            icsRestApi.updateStream(room, streamId, items, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        delete("/rooms/{room}/streams/{stream}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val streamId = call.parameters["stream"] ?: throw IllegalArgumentException("Parameter streamId not found")
            icsRestApi.dropParticipant(room, streamId, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        post("/rooms/:room/streaming-ins") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val post = call.receive<PostStreamingIn>()

            icsRestApi.startStreamingIn(room, post.url, post.transport, post.media, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        delete("/rooms/{room}/streaming-ins/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val streamId = call.parameters["id"] ?: throw IllegalArgumentException("Parameter streamId not found")
            icsRestApi.stopStreamingIn(room, streamId, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms/{room}/streaming-outs") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            icsRestApi.getStreamingOuts(room, { streamingOuts ->
                call.respond(streamingOuts)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        post("/rooms/{room}/streaming-outs") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val post = call.receive<PostStreamingOut>()
            icsRestApi.startStreamingOut(room, post.url, post.media, { info ->
                call.respond(info)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        patch("/rooms/{room}/streaming-outs/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val id = call.parameters["id"] ?: throw IllegalArgumentException("Parameter id not found")
            val commands = call.receive<List<SubscriptionControlInfo>>()
            icsRestApi.updateStreamingOut(room, id, commands, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        delete("/rooms/{room}/streaming-outs/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val id = call.parameters["id"] ?: throw IllegalArgumentException("Parameter id not found")
            icsRestApi.stopStreamingOut(room, id, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/rooms/{room}/recordings") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            icsRestApi.getRecordings(room, { streamingOuts ->
                call.respond(streamingOuts)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        post("/rooms/{room}/recordings") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val post = call.receive<PostRecording>()
            icsRestApi.startRecording(room, post.container, post.media, { info ->
                call.respond(info)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        patch("/rooms/{room}/recordings/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val id = call.parameters["id"] ?: throw IllegalArgumentException("Parameter id not found")
            val commands = call.receive<List<SubscriptionControlInfo>>()
            icsRestApi.updateRecording(room, id, commands, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        delete("/rooms/{room}/recordings/{id}") {
            val room = call.parameters["room"] ?: throw IllegalArgumentException("Parameter room not found")
            val id = call.parameters["id"] ?: throw IllegalArgumentException("Parameter id not found")
            icsRestApi.stopRecording(room, id, { result ->
                call.respond(result)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        post("/tokens") {
            val post = call.receive<PostToken>()
            val room = if (post.room.isNullOrBlank())
                sampleRoom ?: throw IllegalArgumentException("Parameter room not found")
            else
                post.room

            //Note: The actual *ISP* and *region* information should be retrieved from the *req* object and filled in the following 'preference' data.
            val preference = Preference(
                isp = "isp",
                region = "region"
            )
            icsRestApi.createToken(room, post.user, post.role, preference, { token ->
                call.respond(token)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        // legacy interface
        post("/createToken/") {
            val post = call.receive<CreateToken>()
            val room = if (post.room.isNullOrBlank())
                sampleRoom ?: throw IllegalArgumentException("Parameter room not found")
            else
                post.room

            //Note: The actual *ISP* and *region* information should be retrieved from the *req* object and filled in the following 'preference' data.
            val preference = Preference(
                isp = "isp",
                region = "region"
            )
            icsRestApi.createToken(room, post.username, post.role, preference, { token ->
                call.respond(token)
            }, { status, err ->
                call.respond(status, err)
            })
        }

        get("/") {
            call.respond(FreeMarkerContent("index.ftl", mapOf("turn" to turnModel), "e"))
        }

        static("/") {
            resources("public")
            resource("scripts/oms.js", "sdk/oms.js")
        }
    }

    suspend fun initSampleRoom() {
        icsRestApi.getRooms(pageOption, { rooms ->
            print("${rooms.size} rooms in this service.")
            for (room in rooms) {
                if (sampleRoom == null && room.name == "sampleRoom") {
                    sampleRoom = room._id
                    print("sampleRoom Id:$sampleRoom")
                }
                if (sampleRoom != null) {
                    break
                }
            }

            fun tryCreate(room: Room, callback: (String) -> Unit) {
                val options = Room()

                if (room.name == null) {
                    throw(Exception("room.name is null"))
                }
                launch {
                    icsRestApi.createRoom(room.name, options, { roomId ->
                        if (roomId._id == null) {
                            throw(Exception("roomId._id is null"))
                        }
                        print("Created room:${room._id}")
                        callback(roomId._id)
                    }, { _, err ->
                        print("Error in creating room:$err, [Retry]")
                        delay(100L)
                        tryCreate(room, callback)
                    })
                }
            }

            if (sampleRoom == null) {
                val room = Room(name = "sampleRoom")
                tryCreate(room) { Id ->
                    sampleRoom = Id
                    print("sampleRoom Id:$sampleRoom")
                }
            }
        }, null)
    }

    launch {
        initSampleRoom()
    }
}