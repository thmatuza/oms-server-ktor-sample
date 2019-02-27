package com.thmatuza.oms.server.ktor.sample

import io.ktor.config.MapApplicationConfig
import io.ktor.http.HttpMethod
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.withTestApplication
import kotlin.test.Test

class ApplicationTest {
    @Test
    fun testRoot() {
        withTestApplication({
            (environment.config as MapApplicationConfig).apply {
                // Set here the properties
                put("ics.service", "_service_ID_")
                put("ics.key", "_service_KEY_")
                put("ics.uri", "http://localhost:3000")
                put("turn.host", "localhost")
                put("turn.port", "3478")
                put("turn.username", "username")
                put("turn.password", "password")
            }
            module(testing = true)
        }) {
            handleRequest(HttpMethod.Get, "/").apply {
                //assertEquals(HttpStatusCode.OK, response.status())
                //assertEquals("HELLO WORLD!", response.content)
            }
        }
    }
}
