package org.citopt.connde.repository;

import org.citopt.connde.domain.component.Component;
import org.citopt.connde.repository.projection.ComponentExcerpt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComponentRepository<C extends Component> extends MongoRepository<C, String> {
    C findByName(@Param("name") String name);

    List<ComponentExcerpt> findAllByAdapterId(@Param("adapter.id") String adapterId);

    List<ComponentExcerpt> findAllByDeviceId(@Param("device.id") String deviceId);
}