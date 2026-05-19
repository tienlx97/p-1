"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Radio, RadioGroup } from "react-aria-components";
import { categories, journalPrompts, moods } from "@/entities/memory";
import { Field, SelectField, SelectItem, TextAreaField } from "@/shared/components/ui";

import { cx } from "@/shared/lib/styles";

export function CheckinFormMock() {
  const [activePrompt, setActivePrompt] = useState(journalPrompts[1]);
  const [locationMode, setLocationMode] = useState("search");
  const [title, setTitle] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const mediaItemsRef = useRef([]);
  const canSave = title.trim().length > 0 && memoryDate.length > 0 && placeName.trim().length > 0 && mediaItems.length > 0;

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      for (const item of mediaItemsRef.current) {
        URL.revokeObjectURL(item.url);
      }
    };
  }, []);

  function addMediaItems(event) {
    const files = [...(event.currentTarget.files ?? [])];

    if (files.length === 0) {
      return;
    }

    const nextItems = files.map((file) => ({
      id: createMediaId(),
      name: file.name,
      size: file.size,
      type: file.type.startsWith("video/") ? "video" : "image",
      url: URL.createObjectURL(file)
    }));

    setMediaItems((currentItems) => [...currentItems, ...nextItems]);
    event.currentTarget.value = "";
  }

  function removeMediaItem(id) {
    setMediaItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id);

      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.url);
      }

      return currentItems.filter((item) => item.id !== id);
    });
  }

  return (
    <form
      className={cx("create-layout")}
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) {
          return;
        }
      }}
    >
      <section className={cx("form-panel")}>
        <div className={cx("form-section")}>
          <Field
            label="Tiêu đề"
            value={title}
            onChange={setTitle}
            placeholder="Ví dụ: Xem hoàng hôn ở cầu Mống"
            isRequired
          />

          <TextAreaField
            label="Nhật ký ngắn"
            rows={6}
            placeholder="Viết vài dòng để sau này đọc lại vẫn nhớ cảm giác hôm đó."
          />

          <div className={cx("prompt-list")} aria-label="Gợi ý viết nhật ký">
            {journalPrompts.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                className={activePrompt === prompt ? cx("prompt-chip active") : cx("prompt-chip")}
                onPress={() => setActivePrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        <div className={cx("form-section")}>
          <section className={cx("quick-media-section create-media-section")} aria-label="Thêm ảnh hoặc video">
            <div className={cx("quick-media-section-head")}>
              <div>
                <strong>Ảnh và video</strong>
                <small>Thêm media sau khi đã nhập thông tin chính.</small>
              </div>
              {mediaItems.length > 0 ? <span>{mediaItems.length} file</span> : null}
            </div>

            <label className={cx("upload-zone create-upload-zone")} htmlFor="create-photos">
              <Input id="create-photos" type="file" accept="image/*,video/*" multiple onChange={addMediaItems} />
              <span aria-hidden="true">+</span>
              <strong>Kéo ảnh/video vào đây hoặc chọn từ thiết bị</strong>
              <small>Tối đa 10 media cho một kỷ niệm, có thể gồm ảnh và video ngắn.</small>
            </label>

            {mediaItems.length > 0 ? (
              <div className={cx("quick-media-preview create-media-preview")} aria-label="Ảnh và video đã chọn">
                {mediaItems.map((item) => (
                  <figure className={cx("quick-media-item")} key={item.id}>
                    {item.type === "video" ? (
                      <video src={item.url} muted playsInline preload="metadata" />
                    ) : (
                      <img alt="" src={item.url} />
                    )}
                    <figcaption>
                      <strong>{item.name}</strong>
                      <small>{item.type === "video" ? "Video" : "Ảnh"} · {formatFileSize(item.size)}</small>
                    </figcaption>
                    <Button
                      aria-label={`Xóa ${item.name}`}
                      className={cx("quick-media-remove")}
                      type="button"
                      onPress={() => removeMediaItem(item.id)}
                    >
                      ×
                    </Button>
                  </figure>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </section>

      <aside className={cx("form-panel sticky-panel")}>
        <div className={cx("form-section")}>
          <div className={cx("section-heading compact-heading")}>
            <div>
              <p className={cx("eyebrow")}>Vị trí</p>
              <h2>Gắn địa điểm</h2>
            </div>
          </div>

          <RadioGroup
            aria-label="Cách gắn địa điểm"
            className={cx("segmented")}
            value={locationMode}
            onChange={setLocationMode}
          >
            <Radio className={cx("segmented-option")} value="gps">
              ⌖ GPS
            </Radio>
            <Radio className={cx("segmented-option")} value="search">
              ⌕ Tìm kiếm
            </Radio>
            <Radio className={cx("segmented-option")} value="pin">
              ◉ Chọn bản đồ
            </Radio>
          </RadioGroup>

          <Field
            label="Tên địa điểm"
            value={placeName}
            onChange={setPlaceName}
            placeholder="Tên quán, cây cầu, công viên..."
            isRequired
          />

          <Field
            label="Địa chỉ"
            value={address}
            onChange={setAddress}
            placeholder="Số nhà, đường, phường/xã, thành phố..."
          />

          <div className={cx("field-grid location-detail-grid")}>
            <Field
              label="Tọa độ"
              value={coordinates}
              onChange={setCoordinates}
              placeholder="10.77689, 106.70090"
              description="Nhập theo dạng vĩ độ, kinh độ."
            />
            <Field
              label="URL Google Maps"
              type="url"
              value={googleMapsUrl}
              onChange={setGoogleMapsUrl}
              placeholder="https://maps.google.com/?q=10.77689,106.70090"
              description="Dán link chia sẻ từ Google Maps nếu đã có sẵn địa điểm."
            />
          </div>

          <div className={cx("location-picker")}>
            <span className={cx("location-pin")} />
          </div>
        </div>

        <div className={cx("form-section")}>
          <div className={cx("field-grid")}>
            <SelectField label="Nhóm" defaultSelectedKey="coffee">
                {categories.map((category) => (
                  <SelectItem id={category.id} key={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectField>

            <SelectField label="Cảm xúc" defaultSelectedKey="peaceful">
                {moods.map((mood) => (
                  <SelectItem id={mood.id} key={mood.id}>
                    {mood.name}
                  </SelectItem>
                ))}
            </SelectField>
          </div>

          <Field
            label="Ngày kỷ niệm"
            type="date"
            value={memoryDate}
            onChange={setMemoryDate}
            isRequired
          />

          <RadioGroup
            aria-label="Trạng thái lưu"
            className={cx("visibility-choice")}
            defaultValue="private"
          >
            <Radio value="private">
              <span>Chỉ hai người</span>
            </Radio>
            <Radio value="draft">
              <span>Bản nháp</span>
            </Radio>
          </RadioGroup>

          <Button className={cx("btn btn-primary submit-btn")} type="submit" isDisabled={!canSave}>
            <span aria-hidden="true">✓</span>
            Lưu kỷ niệm
          </Button>
        </div>
      </aside>
    </form>
  );
}

function createMediaId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
