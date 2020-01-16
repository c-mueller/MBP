package org.citopt.connde.security.oauth2.authorization;

import java.util.Arrays;

import javax.ws.rs.BeanParam;

import org.citopt.connde.constants.Constants;
import org.citopt.connde.domain.component.Sensor;
import org.citopt.connde.repository.SensorRepository;
import org.citopt.connde.security.RestAuthenticationEntryPoint;
import org.citopt.connde.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
@EnableAuthorizationServer
public class OAuth2AuthorizationServerConfiguration extends AuthorizationServerConfigurerAdapter {

    private final AuthenticationManager authenticationManager;
    private final ClientUserDetailsServiceImpl clientUserDetailsService;

    public OAuth2AuthorizationServerConfiguration(@Qualifier("authenticationManagerBean") AuthenticationManager authenticationManager,
                                                  @Qualifier("restAuthenticationEntryPoint") RestAuthenticationEntryPoint restAuthenticationEntryPoint,
                                                  @Qualifier("mongoUserDetails") UserDetailsServiceImpl userDetailsService,
                                                  @Qualifier("clientUserDetailsService") ClientUserDetailsServiceImpl clientUserDetailsService) {
        this.authenticationManager = authenticationManager;
        this.clientUserDetailsService = clientUserDetailsService;
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        //TODO real client ids from MongoDB
        clients.inMemory()
                .withClient("test-client")
                .secret("test")
                .authorizedGrantTypes("authorization_code", "refresh_token")
                .scopes("write")
                .authorities(Constants.DEVICE)
                .autoApprove(true)
                .accessTokenValiditySeconds(3600) // 1 hour
                .refreshTokenValiditySeconds(7200) // 2 hours
                .redirectUris("http://192.168.209.207:8080/MBP/api/getAccessCode")
                .and()
                .withClient("mbp")
                .secret("mbp-platform")
                .authorizedGrantTypes("client_credentials")
                .scopes("read")
                .authorities(Constants.ADMIN)
                .autoApprove(true)
                .accessTokenValiditySeconds(3600); // 1 hour
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) {
    	//TODO basic http auth for checkTokenAccess (-> also in RestOauthController)
        security.tokenKeyAccess("permitAll()").checkTokenAccess("permitAll()");
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
        tokenEnhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), accessTokenConverter()));
        endpoints
                .tokenStore(tokenStore())
                .accessTokenConverter(accessTokenConverter())
                .authenticationManager(authenticationManager).userDetailsService(clientUserDetailsService);
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    @Bean
    public DefaultTokenServices tokenServices() {
        DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore());
        defaultTokenServices.setSupportRefreshToken(true);
        return defaultTokenServices;
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        // TODO SigningKey austauschen
        converter.setSigningKey("123");
        return converter;
    }

    @Bean
    public TokenEnhancer tokenEnhancer() {
        return new CustomTokenEnhancer();
    }
}
