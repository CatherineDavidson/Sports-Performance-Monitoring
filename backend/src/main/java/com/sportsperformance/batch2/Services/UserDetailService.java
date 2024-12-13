package com.sportsperformance.batch2.Services;
import com.sportsperformance.batch2.models.Admin;
import com.sportsperformance.batch2.models.Athlete;
import com.sportsperformance.batch2.models.BaseUser;
import com.sportsperformance.batch2.models.Coach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;
@Service
public class UserDetailService implements UserDetailsService {
    @Autowired
    private UserService userService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        BaseUser user = userService.findByEmailOrUsername(username);
        if(user instanceof Athlete){
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(), user.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("ATHLETE")));
        } else if(user instanceof Coach){
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(), user.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("COACH")));
        } else if(user instanceof Admin){
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(), user.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("ADMIN")));
        }
        throw new UsernameNotFoundException("User not found");
    }
}