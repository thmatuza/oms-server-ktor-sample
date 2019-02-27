package com.thmatuza.oms.server.ktor.sample

import java.io.Serializable

data class TurnModel(val host: String, val port: String, val username: String, val password: String) : Serializable