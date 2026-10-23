package com.medicare.service;

import com.medicare.entity.HealthVideo;
import com.medicare.repository.HealthVideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthVideoService {

    private final HealthVideoRepository videoRepository;

    public HealthVideoService(HealthVideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    public List<HealthVideo> getAllVideos(String category, String search) {
        List<HealthVideo> list;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            list = videoRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            list = videoRepository.findAll();
        }

        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            return list.stream().filter(v ->
                    (v.getTitle() != null && v.getTitle().toLowerCase().contains(q)) ||
                    (v.getCategory() != null && v.getCategory().toLowerCase().contains(q)) ||
                    (v.getTag() != null && v.getTag().toLowerCase().contains(q))
            ).toList();
        }

        return list;
    }
}
