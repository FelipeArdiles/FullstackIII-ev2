package cl.duoc.innovatech.bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient proyectosClient(@Value("${services.proyectos.url}") String url) {
        return WebClient.builder().baseUrl(url).build();
    }

    @Bean
    public WebClient recursosClient(@Value("${services.recursos.url}") String url) {
        return WebClient.builder().baseUrl(url).build();
    }
}
