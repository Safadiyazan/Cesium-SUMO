import React, { useState, useEffect, useCallback } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { JulianDate } from 'cesium';

const TimelineControls = ({ viewer }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (viewer) {
            const clock = viewer.clock;
            clock.onTick.addEventListener(handleTick);

            // Set initial duration
            if (clock.stopTime && clock.startTime) {
                const totalSeconds = JulianDate.secondsDifference(clock.stopTime, clock.startTime);
                setDuration(totalSeconds);
            }

            return () => {
                clock.onTick.removeEventListener(handleTick);
            };
        }
    }, [viewer]);

    const handleTick = useCallback((clock) => {
        if (clock.shouldAnimate) {
            const currentSeconds = JulianDate.secondsDifference(clock.currentTime, clock.startTime);
            setCurrentTime(currentSeconds);
        }
    }, [viewer]);

    const togglePlayPause = () => {
        if (viewer) {
            viewer.clock.shouldAnimate = !viewer.clock.shouldAnimate;
            setIsPlaying(viewer.clock.shouldAnimate);
        }
    };

    const handleReset = () => {
        if (viewer) {
            viewer.clock.currentTime = viewer.clock.startTime;
            setCurrentTime(0);
        }
    };

    const handleSpeedChange = (newSpeed) => {
        if (viewer) {
            viewer.clock.multiplier = newSpeed;
            setSpeed(newSpeed);
        }
    };

    const handleScrubberChange = (e) => {
        if (viewer) {
            const newTimeInSeconds = parseFloat(e.target.value);
            const newJulianDate = JulianDate.addSeconds(viewer.clock.startTime, newTimeInSeconds, new JulianDate());
            viewer.clock.currentTime = newJulianDate;
            setCurrentTime(newTimeInSeconds);
        }
    };

    const containerStyle = {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(40, 40, 40, 0.8)',
        padding: '10px 20px',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        zIndex: 10,
        color: 'white',
        width: '50%',
        maxWidth: '600px'
    };

    if (!viewer || duration === 0) {
        return null; // Don't render if viewer isn't ready or if there's no simulation loaded
    }

    return (
        <div style={containerStyle}>
            <Button variant="link" onClick={togglePlayPause} style={{color: 'white'}}>
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} fs-4`}></i>
            </Button>
            <Button variant="link" onClick={handleReset} style={{color: 'white'}}>
                <i className="bi bi-skip-start-fill fs-4"></i>
            </Button>
            <Form.Range 
                value={currentTime}
                min={0}
                max={duration}
                step={1}
                onChange={handleScrubberChange}
                style={{ flexGrow: 1 }}
            />
            <ButtonGroup>
                {[0.5, 1, 2, 4].map(rate => (
                    <Button 
                        key={rate} 
                        variant={speed === rate ? 'light' : 'outline-light'} 
                        size="sm"
                        onClick={() => handleSpeedChange(rate)}>
                        {rate}x
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    );
};

export default TimelineControls;
