package com.thmatuza.oms.server.ktor.sample

import com.fasterxml.jackson.annotation.JsonProperty
import kotlinx.serialization.Serializable

enum class TransportProtocol {
    @JsonProperty("tcp")
    TCP,
    @JsonProperty("udp")
    UDP
}

enum class JsonPatchOperation {
    @JsonProperty("add")
    ADD,
    @JsonProperty("remove")
    REMOVE,
    @JsonProperty("replace")
    REPLACE,
    @JsonProperty("move")
    MOVE,
    @JsonProperty("copy")
    COPY,
    @JsonProperty("test")
    TEST
}

enum class RecordingContainer {
    @JsonProperty("mp4")
    MP4,
    @JsonProperty("mkv")
    MKV,
    @JsonProperty("ts")
    TS,
    @JsonProperty("auto")
    AUTO
}

enum class AudioCodec {
    @JsonProperty("pcmu")
    PCMU,
    @JsonProperty("pcma")
    PCMA,
    @JsonProperty("opus")
    OPUS,
    @JsonProperty("g722")
    G722,
    @JsonProperty("isac")
    ISAC,
    @JsonProperty("ilbc")
    ILBC,
    @JsonProperty("aac")
    AAC,
    @JsonProperty("ac3")
    AC3,
    @JsonProperty("nellymoser")
    NELLYMOSER
}

enum class VideoCodec {
    @JsonProperty("h264")
    H264,
    @JsonProperty("h265")
    H265,
    @JsonProperty("vp8")
    VP8,
    @JsonProperty("vp9")
    VP9
}

enum class VideoProfile {
    B,
    CB,
    M,
    H,
    E
}

@Serializable
data class Room(
    val __v: Int? = null,
    val _id: String? = null,
    val name: String? = null,
    val participantLimit: Int? = null,                    // -1 means no limit
    val inputLimit: Int? = null,
    val roles: List<Role>? = null,
    val views: List<View>? = null,
    val mediaIn: MediaIn? = null,
    val mediaOut: MediaOut? = null,
    val transcoding: Transcoding? = null,
    val notifying: Notifying? = null,
    val sip: Sip? = null
) {
    @Serializable
    data class Role(
        val role: String,
        val publish: Prop,
        val subscribe: Prop
    ) {
        @Serializable
        data class Prop(
            val video: Boolean,
            val audio: Boolean
        )
    }

    @Serializable
    data class View(
        val label: String,
        val audio: ViewAudio,
        val video: ViewVideo? = null
    ) {
        @Serializable
        data class ViewAudio(
            val format: AudioFormat,
            val vad: Boolean
        )
    }

    @Serializable
    data class ViewVideo(
        val format: VideoFormat,
        val parameters: Parameters,
        val maxInput: Int,                           // positive integer
        val bgColor: Color,
        val motionFactor: Double,                       // float
        val keepActiveInputPrimary: Boolean,
        val layout: Layout
    ) {
        @Serializable
        data class Parameters(
            val resolution: Resolution,
            val framerate: Int,                        // valid values in [6, 12, 15, 24, 30, 48, 60]
            val bitrate: Int,                          // Kbps
            val keyFrameInterval: Int                 // valid values in [100, 30, 5, 2, 1]
        )

        @Serializable
        data class Color(
            val r: Int,
            val g: Int,
            val b: Int
        )

        @Serializable
        data class Layout(
            val fitPolicy: String,                        // "letterbox" or "crop".
            val templates: Templates
        ) {
            @Serializable
            data class Templates(
                val base: String,                           // valid values ["fluid", "lecture", "void"].
                val custom: List<TemplatesRegion> = listOf()
            ) {
                @Serializable
                data class TemplatesRegion(
                    val region: List<Region> = listOf()
                )
            }
        }
    }

    @Serializable
    data class MediaIn(
        val audio: List<AudioFormat> = listOf(),              // Refers to the AudioFormat above.
        val video: List<VideoFormat> = listOf()               // Refers to the VideoFormat above.
    )

    @Serializable
    data class MediaOut(
        val audio: List<AudioFormat> = listOf(),               // Refers to the AudioFormat above.
        val video: Video
    ) {
        @Serializable
        data class Video(
            val format: List<VideoFormat> = listOf(),            // Refers to the VideoFormat above.
            val parameters: Parameters
        ) {
            @Serializable
            data class Parameters(
                val resolution: List<String> = listOf(),                   // Array of resolution.E.g. ["x3/4", "x2/3", ... "cif"]
                val framerate: List<Int> = listOf(),                    // Array of framerate.E.g. [5, 15, 24, 30, 48, 60]
                val bitrate: List<Any> = listOf(),                      // Array of bitrate.E.g. [500, 1000, ... ]
                val keyFrameInterval: List<Int> = listOf()              // Array of keyFrameInterval.E.g. [100, 30, 5, 2, 1]
            )
        }
    }

    @Serializable
    data class Transcoding(
        val audio: Boolean,
        val video: Video
    ) {
        @Serializable
        data class Video(
            val parameters: Parameters,
            val format: Boolean
        ) {
            @Serializable
            data class Parameters(
                val resolution: Boolean,
                val framerate: Boolean,
                val bitrate: Boolean,
                val keyFrameInterval: Boolean
            )
        }
    }

    @Serializable
    data class Notifying(
        val participantActivities: Boolean,
        val streamChange: Boolean
    )

    @Serializable
    data class Sip(
        val sipServer: String,
        val username: String,
        val password: String
    )
}

@Serializable
data class AudioFormat(
    val codec: AudioCodec,                            // "opus", "pcmu", "pcma", "aac", "ac3", "nellymoser"
    val sampleRate: Int,                       // "opus/48000/2", "isac/16000/2", "isac/32000/2", "g722/16000/1"
    val channelNum: Int                        // E.g "opus/48000/2", "opus" is codec, 48000 is sampleRate, 2 is channelNum
)

@Serializable
data class VideoFormat(
    val codec: VideoCodec,                            // "h264", "vp8", "h265", "vp9"
    val profile: VideoProfile?                           // For "h264" output only, CB", "B", "M", "H"
)

@Serializable
data class Resolution(
    val width: Int,
    val height: Int
)

@Serializable
data class Region(
    val id: Int,
    val shape: String,
    val area: Rect
) {
    @Serializable
    data class Rect(
        val left: String,
        val top: String,
        val width: String,
        val height: String
    )
}

@Serializable
data class RoomUpdate(
    val op: JsonPatchOperation,
    val path: String,
    val value: Any
)

@Serializable
data class ParticipantDetail(
    val id: String,
    val role: String,
    val user: String,
    val permission: Permission
) {
    @Serializable
    data class Permission(
        val publish: Prop? = null,
        val subscribe: Prop? = null
    ) {
        @Serializable
        data class Prop(
            val audio: Boolean,
            val video: Boolean
        )
    }
}

@Serializable
data class PermissionUpdate(
    val op: JsonPatchOperation,
    val path: String,
    val value: Any
)

@Serializable
data class StreamInfo(
    val id: String,
    val type: String,
    val media: MediaInfo,
    val info: Any
) {
    @Serializable
    data class MediaInfo(
        val audio: AudioInfo? = null,
        val video: VideoInfo? = null
    ) {
        @Serializable
        data class AudioInfo(
            val status: String?,
            val source: String?,
            val format: AudioFormat,
            val optional: Optional
        ) {
            @Serializable
            data class AudioFormat(
                val codec: AudioCodec,
                val sampleRate: Int?,
                val channelNum: Int?
            )

            @Serializable
            data class Optional(
                val format: List<AudioFormat> = listOf()
            )
        }

        @Serializable
        data class VideoInfo(
            val status: String?,
            val source: String?,
            val format: VideoFormat,
            val parameters: VideoParameters,
            val optional: Optional
        ) {
            @Serializable
            data class VideoParameters(
                val resolution: Resolution?,
                val framerate: Int?,
                val bitrate: Int?,
                val keyFrameInterval: Int?
            )

            @Serializable
            data class Optional(
                val format: List<VideoFormat> = listOf(),
                val parameters: Parameters
            ) {
                @Serializable
                data class Parameters(
                    val resolution: List<Resolution> = listOf(),
                    val framerate: List<Int> = listOf(),
                    val bitrate: List<Any> = listOf(),
                    val keyFrameInterval: List<Int> = listOf()
                )
            }
        }
    }
}

@Serializable
data class StreamInfoUpdate(
    val op: JsonPatchOperation,
    val path: String,
    val value: Any
)

@Serializable
data class ForwardInfo(
    val owner: String,
    val type: String,
    val inViews: List<String> = listOf(),
    val attributes: ExternalDefinedObj
) {
    @Serializable
    data class ExternalDefinedObj(
        val dummy: String
    )
}

@Serializable
data class MixedInfo(
    val label: String,
    val layout: List<Element> = listOf()
) {
    @Serializable
    data class Element(
        val stream: String?,
        val region: Region
    )
}

@Serializable
data class VideoParametersSpecification(
    val resolution: Resolution,
    val framerate: Int,
    val bitrate: Any,
    val keyFrameInterval: Int
)

@Serializable
data class StreamingOut(
    val id: String,
    val media: OutMedia,
    val url: String
)

@Serializable
data class OutMedia(
    val audio: StreamingOutAudio? = null,
    val video: StreamingOutVideo? = null
) {
    @Serializable
    data class StreamingOutAudio(
        val status: String,
        val from: String,
        val format: AudioFormat
    )

    @Serializable
    data class StreamingOutVideo(
        val status: String,
        val from: String,
        val format: VideoFormat,
        val parameters: VideoParametersSpecification?
    )
}

@Serializable
data class MediaSubOptions(
    val audio: AudioSubOptions? = null,
    val video: VideoSubOptions? = null
) {
    @Serializable
    data class AudioSubOptions(
        val from: String,
        val format: AudioFormat? = null
    )

    @Serializable
    data class VideoSubOptions(
        val from: String,
        val format: VideoFormat? = null,
        val parameters: VideoParametersSpecification? = null
    )
}

@Serializable
data class SubscriptionControlInfo(
    val op: JsonPatchOperation,
    val path: String,
    val value: Any
)

@Serializable
data class Recordings(
    val id: String,
    val media: OutMedia,
    val storage: Storage
) {
    @Serializable
    data class Storage(
        val host: String,
        val file: String
    )
}

@Serializable
data class Preference(
    val isp: String,
    val region: String
)